module SessionsHelper
    private
    def user_id
        # Assume this is derived from parsed JWT token or cookie session
        1
    end

    def hours_and_minutes(time)
        hours = time/60
        minutes = time - (hours*60)
        return {
            hours: hours,
            minutes: minutes
        }
    end

    def id
        params[:id]
    end

    def mapper(val)
        data = val.as_json
        data["session_length_hm"] = hours_and_minutes(data["session_length"])
        return data
    end

    def session_params
        params.require(:session).permit(
            :task_id,
            :start,
            :end
        )
    end
end
