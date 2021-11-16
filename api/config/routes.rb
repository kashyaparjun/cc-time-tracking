Rails.application.routes.draw do
  resources :tasks, except: [:destroy]
end
