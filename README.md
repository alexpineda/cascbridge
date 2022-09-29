# CASCBridge

An http file server and UI for `CASC` archive data.

Run the application, assign the port, assign your Starcraft directory and press `Start Server`. 


## Javascript Usage Example

```ts


const animBuffer = await fetch("http://localhost:8080/anim/main000.anim").then(res => res.arrayBuffer());


```