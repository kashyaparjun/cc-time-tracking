class AddUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string  :email, null: false, unique: true
      t.string  :firstname
      t.string  :lastname

      t.timestamps
    end
  end
end
