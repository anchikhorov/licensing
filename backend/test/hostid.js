//import {machineId, machineIdSync} from 'node-machine-id';
const machineid = require('node-machine-id')

let id = machineid.machineIdSync({original: true})
//let id = machineIdSync({original: true})

console.log(id)