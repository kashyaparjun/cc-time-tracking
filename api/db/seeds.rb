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

Task.create(
  instructions: 'Write an autobiography about Marie Curie.',
  user: ben
)
Task.create(
  instructions: 'Write an autobiography about Rosalind Franklin.',
  user: ben
)
