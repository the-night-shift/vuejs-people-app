class V1::PeopleController < ApplicationController
  def index
    people = Person.all
    render json: people.as_json
  end

  def create
    # take in the params
    # save a thing to the db
    person = Person.new(
      name: params[:inputName],
      bio: params[:inputBio]
    )
    person.save
    render json: person.as_json
    # render that thing
  end
end
