class Session < ApplicationRecord
  belongs_to :user
  belongs_to :task

  validates :start, presence: true
  validates :end, presence: true
end
