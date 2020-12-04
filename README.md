# Gibber Graph

[https://gibber-graph.glitch.me/](https://gibber-graph.glitch.me/)

## Video

[https://www.youtube.com/watch?v=KxEknSOGMfk](https://www.youtube.com/watch?v=KxEknSOGMfk)

## Summary

This project is an audio playground that utilizes Litegraph to abstract Gibberish objects into a node editor style. Users can save, load, and download their current session.

## Instructions

1. Sign in using GitHub OAuth
2. (a) Add nodes by right clicking in the window to show a drop down
   Gibberish nodes implemented:

- Instruments
- Oscillators
- Effects
- Helper (ArrayNode used to simplify timings/values for gibberish objects)

2. (b) Optionally there are demos to load in the drop down in the header
3. Click play to start your playback

Note: you are only able to save one session at a time. If you hit save, it will overwrite your previously saved work. Download a copy if you wish to keep a current project for later use.

## Added Nodes

LiteGraph provides many nodes by default, some of which work with the new Gibberish nodes

The Gibberish nodes are under the following categories:

- instrument
- oscillator
- effect

## Technologies

- Svelte
- LiteGraph (via CDN)
- Gibberish (via CDN)
- Bootstrap (via CDN)
- Parcel

## Challenges

Litegraph and Gibberish have very large build sizes and because of that, Parcel was taking up too many system resources on bundling. This caused our project to crash repeatedly, so we moved to using a CDN to deliver these packages. If we didn't have to do this we could've edited more of the source code and made more features like we had planned

Another problem we encountered was how to get the audio of Litegraph to work with Gibberish, as it does with the sounds that initally come with Litegraph. To remediate this problem we had to understand how the fundamentals of Gibberish audio works, and how to pair it with Litegraph.

The way effects are handled in Gibberish are intuitive for performing live but in this project there is a slight workaround for how effects are used. Instead of the effect itself being passed into a sequencer like one would expect, we have to pass the instrument "through" the effect node, while also adding the instrument into the gibberish object internally. This isn't quite intuitive, but the abstraction means the user doesn't see this complication

## Team Member Jobs

- Robby: Worked on making Gibberish ❤️ LiteGraph

- Alex: Worked on effects, base code for server, demos and a special surprise

- Kyle: Worked on the MongoDB backend, fetching and responses for the client side to communicate with the backend, bootstrap styles on default landing page and logged in page.

- Alexa: Worked on the backend, MongoDb to create a persistent database that will communicate with the client side via fetching and responses; created demos; worked on the login.html page, including animiations.

## Some Notes

- We were able to integrate the SillyClient node into our project, check out the "Networking (Beta)" demo
  - The value of the gain is sent over the network in "Send", and received in the node "Receive"
  - Both values are graphed (you can see the delay, and any differences due to lag)
- Gibberish seems to look for a left-click before loading, so sometimes you have to open the right-click menu twice in order for the nodes to be added
