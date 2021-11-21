class CreateSessions < ActiveRecord::Migration[5.2]
  def change
    create_table :sessions do |t|
      t.references :user, foreign_key: true
      t.references :task, foreign_key: true
      t.timestamp :start, null: false
      t.timestamp :end, null: false

      t.timestamps
    end
  end
end
