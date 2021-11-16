class AddTasks < ActiveRecord::Migration[5.2]
  def change
    create_table :tasks do |t|
      t.string      :instructions, null: false
      t.string      :answer
      t.boolean     :submitted, default: false, null: false
      t.references  :user

      t.timestamps
    end
  end
end
