class User < ApplicationRecord
  has_many :tasks
  has_many :sessions
end
