# Gibber Graph

[https://gibber-graph.glitch.me/](https://gibber-graph.glitch.me/)

## Summary

This project is an audio playground that utilizes Litegraph to abstract Gibberish objects into a node editor style. Users can save, load, and download their current session.

## Instructions

Sign in using GitHub OAuth
Add nodes by right clicking in the window to show a drop down
Gibberish nodes implemented:
- Instruments
- Oscillators
- Effects
- Helper (ArrayNode used to simplify timings/values for gibberish objects)

Optionally there are demos to load in the drop down in the header
Click play to start your playback

Note: you are only able to save one session at a time. If you hit save, it will overwrite your previously saved work. Download if you wish to keep a current project for later use

## Technologies

- Svelte
- Litegraph (via CDN)
- Gibberish (via CDN)
- Bootstrap
- Parcel

## Challenges

Litegraph and Gibberish have very large build sizes and because of that, Parcel was taking up too many system resources on bundling. This caused our project to crash repeatedly, so we moved to using a CDN to deliver these packages. If we didn't have to do this we could've edited more of the source code and made more features like we had planned


Another problem we encountered was how to get the audio of Litegraph to work with Gibberish, as it does with the sounds that initally come with Litegraph. To remediate this problem we had to understand how the fundamentals of Gibberish audio works, and how to pair it with Litegraph. 


The way effects are handled in gibberish are intuitive for performing live but in this project there is a slight workaround for how effects are used. Instead of the effect itself being passed into a sequencer like one would expect, we have to pass the instrument "through" the effect node, while also adding the instrument into the gibberish object internally. This isn't quite intuitive, but the abstraction means the user doesn't see this complication

## Team Member Jobs

-Robby

-Alex: Worked on effects, base code for server

-Kyle: Worked on the MongoDB backend, fetching and responses for the client side to communicate with the backend, bootstrap styles on default landing page and logged in page.

-Alexa: Worked on the backend, MongoDb persistent database and created animiations for the index.html page. 