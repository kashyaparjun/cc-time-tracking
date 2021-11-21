require 'time';

class SessionsController < ApplicationController
    include SessionsHelper
    include ApplicationHelper

    def index
        begin
            total_time = Session.select(
                "CAST(SUM((julianday(end) - julianday(start)) * 60 * 24) AS Integer) AS total_time"
            )
            .where(["user_id = :user_id", { user_id: user_id }])[0]["total_time"]

            total_tasks = Session.select(:task_id).where(["user_id = :user_id", { user_id: user_id }])
                .distinct.count(:task_id)

            tasks_completed = Task.select(:id)
                .where(["user_id = :user_id", { user_id: user_id }])
                .where("submitted = 1")
                .distinct.count(:id)

            avg_session_time = Session.select(
                "CAST(AVG((julianday(end) - julianday(start)) * 60 * 24) AS Integer) AS avg_session_time"
            )
            .where(["user_id = :user_id", { user_id: user_id }])[0]["avg_session_time"]

            data = {
                total_time: hours_and_minutes(total_time),
                total_tasks: total_tasks,
                tasks_completed: tasks_completed,
                avg_time_per_task: hours_and_minutes(total_time/total_tasks),
                avg_session_time: hours_and_minutes(avg_session_time)
            }

            render json: { success: true, data: data }, status: 200
            
        rescue => exception
            log_error("Sessions#index", exception.message)
            render json: { success: false, errors: exception.message }, status: 500
        end
    end

    def show
        begin
            sessions = Session.select(
                :id,
                :user_id,
                :task_id,
                :instructions,
                :answer,
                :submitted,
                "CAST(SUM((julianday(end) - julianday(start)) * 60 * 24) AS Integer) AS session_length",
            )
            .joins(:task)
            .group(:task_id)
            .having(["task_id = :task_id", { task_id: id }])

            return render(json: { success: false, errors: "Session not found" }) \
                if sessions.blank?

            render json: { success: true, data: sessions.map{ |e| mapper(e) } }

        rescue => exception
            log_error("Sessions#show", exception.message)
            render json: { success: false, errors: exception.message }, status: 500
        end
    end

    def update
        begin
            session = Session.find_by(id: id, user_id: user_id, task_id: session_params["task_id"])

            if session.nil?
                return render(
                    json: { success: false, errors: "Session doesn't exist" },
                    status: 403
                )
            end

            # Calculating time difference between the UI and server (Both times in UTC)
            diff = (DateTime.now.utc - Time.parse(session_params["end"]))/60

            # Check for time validity, reject if time difference between server and UI is greater than 5 mins
            if session_params["end"] < session["start"] or session_params["end"] < session["end"] \
                or session_params["end"] > DateTime.now.utc or diff > 5
                return render(
                    json: { success: false, errors: "Invalid end time" },
                    status: 403
                )
            end

            success = session.update({ end: session_params["end"] })

            return render(
                json: {
                    success: success,
                    errors: session.errors,
                    data: session
                },
                status: success ? 200 : 422
            )

        rescue => exception
            log_error("Sessions#update", exception.message)
            render json: { success: false, errors: exception.message }, status: 500
        end
    end

    def create
        begin
            task = Task.find(session_params["task_id"])

            return render(json: { success: false, errors: "Task doesn't exist" }, status: 403) \
                if task.nil?
            
            # Calculating time difference between the UI and server (Both times in UTC)
            diff = (DateTime.now.utc - Time.parse(session_params["start"]))/60

            # If the UI time in UTC is greater than server or is greater than 5 mins, reject request
            if session_params["start"] > DateTime.now.utc or diff > 5
                return render(
                    json: { success: false, errors: "Invalid start time" },
                    start: 403
                )
            end
            
            session = Session.create(
                user_id: user_id,
                task: task,
                start: session_params["start"],
                end: session_params["start"]
            )

            return render(
                json: {
                    success: session.errors.blank?,
                    errors: session.errors,
                    data: session
                },
                status: session.errors.blank? ? 200 : 422
            )

        rescue => exception
            log_error("Sessions#create", exception.message)
            render json: { success: false, errors: exception.message }, status: 500
        end
    end
end
