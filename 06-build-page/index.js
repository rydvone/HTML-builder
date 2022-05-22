const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');
