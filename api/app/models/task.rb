class Task < ApplicationRecord
  belongs_to :user

  validates :answer, presence: true, if: :submitted?
end
