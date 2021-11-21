Rails.application.routes.draw do
  resources :tasks, except: [:destroy]
  resources :sessions, except: [:destroy]
end
