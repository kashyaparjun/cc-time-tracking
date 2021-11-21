class Task < ApplicationRecord
  belongs_to :user
  has_many :sessions

  validates :answer, presence: true, if: :submitted?
end
