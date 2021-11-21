module ApplicationHelper
    private
    def log_error(place, message)
        puts "[#{DateTime.now.utc.to_s}] [ERROR] [#{place}] [#{message}]"
    end
end
