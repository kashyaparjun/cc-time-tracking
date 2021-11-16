class TasksController < ApplicationController
  def index
    tasks = Task.all
    render json: { success: true, data: tasks }, status: 200
  end

  def show
    task = Task.find(task_id)
    return render(json: { success: false, errors: 'Task not found' }) \
      if task.nil?

    render json: { success: true, data: task }, status: 200
  end

  def update
    task = Task.find(task_id)

    if task.submitted?
      return render(
        json: { success: false, errors: 'Task already submitted' },
        status: 403
      )
    end

    success = task.update(task_params)
    return render(
      json: {
        success: success,
        errors: task.errors,
        data: task
      },
      status: success ? 200 : 422
    )
  end

private

  def task_params
    params.require(:task).permit(
      :submitted,
      :answer
    )
  end

  def task_id
    params[:id]
  end
end
