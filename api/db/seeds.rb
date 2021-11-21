# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

ben = User.create(
  email: 'ben.utzermann@wonderwerk.co',
  firstname: 'Ben',
  lastname: 'Utzermann'
)

task1 = Task.create(
  instructions: 'Write an autobiography about Marie Curie.',
  user: ben
)

task2 = Task.create(
  instructions: 'Write an autobiography about Rosalind Franklin.',
  user: ben
)

Session.create(
  user: ben,
  task: task1,
  start: DateTime.now.utc,
  end: DateTime.now.utc + 20.minutes
)

Session.create(
  user: ben,
  task: task1,
  start: DateTime.now.utc,
  end: DateTime.now.utc + 10.minutes
)

Session.create(
  user: ben,
  task: task2,
  start: DateTime.now.utc,
  end: DateTime.now.utc + 5.minutes
)


