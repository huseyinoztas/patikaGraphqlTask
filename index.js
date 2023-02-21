const {GraphQLServer, PubSub, withFilter} = require('graphql-yoga')
const {events, locations, users, participants} = require('./data')
const { nanoid } = require('nanoid');


const typeDefs = `

type User {
       id:ID!
       username:String!
       email:String!
       events: [Event!]!
    }

input AddUserInput {
    username: String
    email:String
} 

input UpdateUserInput {
    username: String
    email: String
}

type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID! 
    user_id: ID!
    user: User!
    location:Location!
    participants:[Participant!]!
    }

input AddEventInput {
    title: String
    desc: String
    location_id: ID
    user_id: ID

}   

input UpdateEventInput {
    title: String
    location_id: ID
    user_id: ID
    desc: String
}

type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
    }

input AddLocationInput {
    id: ID
    name: String
}    

input UpdateLocationInput {
    name: String
    desc: String
}

type Participant {
        id:ID!
        user_id: ID!
        event_id: ID!
    }

input AddParticipantInput {
    id: ID
    user_id: ID
    event_id: ID
}

input UpdateParticipantInput {
    user_id: ID
    event_id: ID
}

type DeleteAllOutPut {
        count:Int!
    }


type Query {
    users:[User!]!
    user(id:ID!):User!
    
    events:[Event!]!
    event(id:ID!):Event!
    
    locations:[Location!]!
    location(id:ID!):Location!
    
    participants:[Participant!]!
    participant(id:ID!):Participant!
}

type Mutation {
        addUser(data: AddUserInput!):User!
        updateUser(id:ID!, data: UpdateUserInput! ): User!
        deleteUser(id:ID!):User!
        deleteAllUsers:DeleteAllOutPut!

        addEvent(data:AddEventInput!):Event!
        updateEvent(id:ID!, data:UpdateEventInput!):Event!
        deleteEvent(id:ID!):Event!
        deleteAllEvents:DeleteAllOutPut!

        addLocation(data:AddLocationInput): Location!
        updateLocation(id:ID!, data:UpdateLocationInput!): Location!
        deleteLocation(id:ID!):Location!
        deleteAllLocations:DeleteAllOutPut!

        addParticipant(data:AddParticipantInput): Participant!
        updateParticipant(id:ID!, data:UpdateParticipantInput!): Participant!
        deleteParticipant(id:ID!):Participant!
        deleteAllParticipants:DeleteAllOutPut!
    }

    type Subscription {
        
        userCreated: User!
        userUpdated: User!
        userDeleted: User!
        
        eventCreated: Event!
        eventUpdated: Event!
        eventDeleted: Event!
        
        locationCreated: Location!
        locationUpdated: Location!
        locationDeleted: Location!
        
        participantAdded: Participant!
        participantUpdated: Participant!
        participantDeleted: Participant!
    }
`;

const resolvers = {
    Subscription: {
        userCreated: {
          subscribe: (_, __, { pubsub }) => pubsub.subscribe("userCreated"),
          resolve: (payload) => payload,
        },
        eventCreated: {
          subscribe: (_, __, { pubsub }) => pubsub.subscribe("eventCreated"),
          resolve: (payload) => payload,
        },
        participantAdded: {
          subscribe: (_, __, { pubsub }) => pubsub.subscribe("participantAdded"),
          resolve: (payload) => payload,
        },
        locationCreated: {
            subscribe: (_, __, { pubsub }) => pubsub.subscribe("locationCreated"),
            resolve: (payload) => payload,
          },
      },

    Mutation : {
        addUser: (parent,{data }) => {
            const user = {
                id: nanoid(),
                ...data,
            }

            users.push(user);
            pubsub.publish("userCreated", user);
            return user
        },
        updateUser: (parent, {id,data}) => {
            const user_index = users.findIndex((user)=> user.id === id);
            if(user_index === -1) {
                throw new Error ('user not Found');
            }
            const updated_user = users[user_index] = {
                ...users[user_index],
                ...data,
            }
            return updated_user
        },
        deleteUser:(parent,{id}) => {
            const user_index = users.findIndex((user) => user.id === id);

            if(user_index === -1) {
                throw new Error('User not found');
            }
            const deleted_user = users[user_index]
            users.splice(user_index,1);//kendisini sil demek
            return deleted_user;
        },
        deleteAllUsers: () => {
            const length = users.length;
            users.splice(0, length);

            return {
                count:length,
            }
        },

        addEvent: (parent,{data }) => {
            const event = {
                id: nanoid(),
                ...data,
            }

            events.push(event);
            pubsub.publish("eventCreated", event);
            return event
        },
        updateEvent: (parent, {id,data}) => {
            const event_index = events.findIndex((event)=> event.id === id);
            if(event_index === -1) {
                throw new Error ('Event not Found');
            }
            const updated_event = events[event_index] = {
                ...events[event_index],
                ...data,
            }
            return updated_event
        },
        deleteEvent:(parent,{id}) => {
            const event_index = events.findIndex((event) => event.id === id);

            if(event_index === -1) {
                throw new Error('User not found');
            }
            const deleted_event = events[event_index]
            events.splice(event_index,1);//kendisini sil demek
            return deleted_event;
        },
        deleteAllUsers: () => {
            const length = events.length;
            events.splice(0, length);

            return {
                count:length,
            }
        },

        addLocation: (parent,{data }) => {
            const location = {
                id: nanoid(),
                ...data,
            }

            locations.push(location);
            pubsub.publish("locationCreated", location);
            return location
        },
        updateLocation: (parent, {id,data}) => {
            const location_index = locations.findIndex((location)=> location.id === id);
            if(location_index === -1) {
                throw new Error ('location not Found');
            }
            const updated_location = locations[location_index] = {
                ...locations[location_index],
                ...data,
            }
            return updated_location
        },
        deleteLocation:(parent,{id}) => {
            const location_index = locations.findIndex((location) => location.id === id);

            if(location_index === -1) {
                throw new Error('location not found');
            }
            const deleted_location = locations[location_index]
            locations.splice(location_index,1);//kendisini sil demek
            return deleted_location;
        },
        deleteAllLocations: () => {
            const length = locations.length;
            locations.splice(0, length);

            return {
                count:length,
            }
        },

        addParticipant: (parent,{data }) => {
            const participant = {
                id: nanoid(),
                ...data,
            }

            participants.push(participant);
            pubsub.publish("participantAdded", participant);
            return participant
        },
        updateParticipant: (parent, {id,data}) => {
            const participant_index = participants.findIndex((participant)=> participant.id === id);
            if(participant_index === -1) {
                throw new Error ('participant not Found');
            }
            const updated_participant = participants[participant_index] = {
                ...participants[participant_index],
                ...data,
            }
            return updated_participant
        },
        deleteParticipant:(parent,{id}) => {
            const participant_index = participants.findIndex((participant) => participant.id === id);

            if(participant_index === -1) {
                throw new Error('participant not found');
            }
            const deleted_participant = participants[participant_index]
            participants.splice(participant_index,1);//kendisini sil demek
            return deleted_participant;
        },
        deleteAllParticipants: () => {
            const length = participants.length;
            participants.splice(0, length);

            return {
                count:length,
            }
        },
    },

    Query: {
        users:()=> users,
        user:(parent,args)=> users.find(user=> user.id == args.id),

        events:()=> events,
        event:(parent,args)=> events.find(event=> event.id == args.id),

        locations:()=> locations,
        location:(parent,args)=> locations.find(location => location.id == args.id),

        participants:()=> participants,
        participant:(parent,args)=> participants.find(participant => participant.id == args.id)
    },
    User:{
        events:(parent,args)=> events.filter(event => event.id == parent.id)
    },
    Event:{
        user: (parent) => users.find(user => user.id === parent.user_id),
        location: (parent) => locations.find(location => location.id === parent.user_id ),
        participants:(parent)=> participants.filter(participant => participant.user_id == parent.user_id)
    }
}

const pubsub = new PubSub()
const server = new GraphQLServer({typeDefs,resolvers,context: {pubsub}});

server.start(() => console.log('server running on localhost:400'))