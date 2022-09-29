# CASCBridge

An http file server and UI for `CASC` archive data.

Run the application, assign the port, assign your Starcraft directory and press `Start Server`. 

![image](https://user-images.githubusercontent.com/586716/192916637-3356b4a5-d224-45ad-b9e1-46dd70bedeec.png)



## Javascript Usage Example

```ts


const animBuffer = await fetch("http://localhost:8080/anim/main000.anim").then(res => res.arrayBuffer());


```
