import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Types
interface Topic {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Option {
  optionId: string;
  optionText: string;
}

interface Question {
  questionText: string;
  options: Option[];
  correctOption: string;
}

interface QuestionWithTopic extends Question {
  topicTitle: string;
}

// Hardcoded topics data
const topics: Topic[] = [
  { title: 'JavaScript', difficulty: 'easy' },
  { title: 'React', difficulty: 'easy' },
  { title: 'Node.js', difficulty: 'medium' },
  { title: 'Database Management', difficulty: 'hard' },
  { title: 'System Design', difficulty: 'hard' },
  { title: 'Data Structures', difficulty: 'medium' },
  { title: 'Algorithms', difficulty: 'hard' },
];

// Hardcoded questions data organized by topic
const questionsData: QuestionWithTopic[] = [
  // JavaScript Questions
  {
    topicTitle: 'JavaScript',
    questionText: 'What is the correct way to declare a variable in JavaScript?',
    options: [
      { optionId: '1', optionText: 'var myVar;' },
      { optionId: '2', optionText: 'let myVar;' },
      { optionId: '3', optionText: 'const myVar;' },
      { optionId: '4', optionText: 'All of the above' }
    ],
    correctOption: '4'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'Which method is used to add an element to the end of an array?',
    options: [
      { optionId: '1', optionText: 'push()' },
      { optionId: '2', optionText: 'pop()' },
      { optionId: '3', optionText: 'shift()' },
      { optionId: '4', optionText: 'unshift()' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'What does the "typeof" operator return for an array?',
    options: [
      { optionId: '1', optionText: 'array' },
      { optionId: '2', optionText: 'object' },
      { optionId: '3', optionText: 'list' },
      { optionId: '4', optionText: 'string' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'Which keyword is used to define a function in JavaScript?',
    options: [
      { optionId: '1', optionText: 'method' },
      { optionId: '2', optionText: 'function' },
      { optionId: '3', optionText: 'func' },
      { optionId: '4', optionText: 'def' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'What is the purpose of the "this" keyword in JavaScript?',
    options: [
      { optionId: '1', optionText: 'Refers to the current object' },
      { optionId: '2', optionText: 'Declares a new variable' },
      { optionId: '3', optionText: 'Defines a loop' },
      { optionId: '4', optionText: 'Creates a new function' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'Which method converts a JSON string into a JavaScript object?',
    options: [
      { optionId: '1', optionText: 'JSON.parse()' },
      { optionId: '2', optionText: 'JSON.stringify()' },
      { optionId: '3', optionText: 'JSON.convert()' },
      { optionId: '4', optionText: 'JSON.object()' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'What is the result of "null == undefined" in JavaScript?',
    options: [
      { optionId: '1', optionText: 'true' },
      { optionId: '2', optionText: 'false' },
      { optionId: '3', optionText: 'null' },
      { optionId: '4', optionText: 'undefined' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'Which method is used to remove the last element from an array?',
    options: [
      { optionId: '1', optionText: 'pop()' },
      { optionId: '2', optionText: 'push()' },
      { optionId: '3', optionText: 'shift()' },
      { optionId: '4', optionText: 'unshift()' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'What is a closure in JavaScript?',
    options: [
      { optionId: '1', optionText: 'A function with access to its own scope and outer scope variables' },
      { optionId: '2', optionText: 'A way to lock variables' },
      { optionId: '3', optionText: 'A method to close a loop' },
      { optionId: '4', optionText: 'A type of variable' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'Which operator is used for strict equality comparison?',
    options: [
      { optionId: '1', optionText: '==' },
      { optionId: '2', optionText: '===' },
      { optionId: '3', optionText: '=' },
      { optionId: '4', optionText: '!=' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'What does the "map()" method do in JavaScript?',
    options: [
      { optionId: '1', optionText: 'Creates a new array with transformed elements' },
      { optionId: '2', optionText: 'Removes elements from an array' },
      { optionId: '3', optionText: 'Sorts an array' },
      { optionId: '4', optionText: 'Joins arrays together' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'JavaScript',
    questionText: 'What is the purpose of the "async" keyword?',
    options: [
      { optionId: '1', optionText: 'Declares a function as asynchronous' },
      { optionId: '2', optionText: 'Synchronizes multiple functions' },
      { optionId: '3', optionText: 'Defines a loop' },
      { optionId: '4', optionText: 'Creates a new variable' }
    ],
    correctOption: '1'
  },

  // React Questions
  {
    topicTitle: 'React',
    questionText: 'What is JSX in React?',
    options: [
      { optionId: '1', optionText: 'A JavaScript library' },
      { optionId: '2', optionText: 'A syntax extension for JavaScript' },
      { optionId: '3', optionText: 'A CSS framework' },
      { optionId: '4', optionText: 'A database query language' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'React',
    questionText: 'Which hook is used to manage state in functional components?',
    options: [
      { optionId: '1', optionText: 'useEffect' },
      { optionId: '2', optionText: 'useState' },
      { optionId: '3', optionText: 'useContext' },
      { optionId: '4', optionText: 'useReducer' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'React',
    questionText: 'What is the correct way to import a component in React?',
    options: [
      { optionId: '1', optionText: 'import { Component } from "react";' },
      { optionId: '2', optionText: 'import Component from "react";' },
      { optionId: '3', optionText: 'import { Component } from "react";' },
      { optionId: '4', optionText: 'import Component from "react";' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'React',
    questionText: 'Which of the following is used to pass data from parent to child component?',
    options: [
      { optionId: '1', optionText: 'props' },
      { optionId: '2', optionText: 'state' },
      { optionId: '3', optionText: 'context' },
      { optionId: '4', optionText: 'hooks' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'React',
    questionText: 'What is the correct way to update state in a class-based React component?',
    options: [
      { optionId: '1', optionText: 'this.setState({ count: this.state.count + 1 })' },
      { optionId: '2', optionText: 'this.state.count++' },
      { optionId: '3', optionText: 'this.setState(count + 1)' },
      { optionId: '4', optionText: 'this.setState({ count: count + 1 })' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'React',
    questionText: 'What is the purpose of the useEffect hook?',
    options: [
      { optionId: '1', optionText: 'Manage state' },
      { optionId: '2', optionText: 'Handle side effects in functional components' },
      { optionId: '3', optionText: 'Create context' },
      { optionId: '4', optionText: 'Define props' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'React',
    questionText: 'What is a React component?',
    options: [
      { optionId: '1', optionText: 'A reusable piece of UI' },
      { optionId: '2', optionText: 'A database connection' },
      { optionId: '3', optionText: 'A CSS style' },
      { optionId: '4', optionText: 'A server endpoint' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'React',
    questionText: 'Which method is used to render a React component?',
    options: [
      { optionId: '1', optionText: 'render()' },
      { optionId: '2', optionText: 'display()' },
      { optionId: '3', optionText: 'show()' },
      { optionId: '4', optionText: 'paint()' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'React',
    questionText: 'What is the purpose of the key prop in React?',
    options: [
      { optionId: '1', optionText: 'Identify elements in a list' },
      { optionId: '2', optionText: 'Style components' },
      { optionId: '3', optionText: 'Handle events' },
      { optionId: '4', optionText: 'Store state' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'React',
    questionText: 'What is the default export in a React component file?',
    options: [
      { optionId: '1', optionText: 'The component itself' },
      { optionId: '2', optionText: 'A CSS file' },
      { optionId: '3', optionText: 'A state object' },
      { optionId: '4', optionText: 'A hook' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'React',
    questionText: 'What does the useContext hook do?',
    options: [
      { optionId: '1', optionText: 'Access context values' },
      { optionId: '2', optionText: 'Manage state' },
      { optionId: '3', optionText: 'Handle side effects' },
      { optionId: '4', optionText: 'Define props' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'React',
    questionText: 'Which lifecycle method is replaced by useEffect in functional components?',
    options: [
      { optionId: '1', optionText: 'componentDidMount' },
      { optionId: '2', optionText: 'render' },
      { optionId: '3', optionText: 'constructor' },
      { optionId: '4', optionText: 'setState' }
    ],
    correctOption: '1'
  },

  // Node.js Questions
  {
    topicTitle: 'Node.js',
    questionText: 'What is Node.js primarily used for?',
    options: [
      { optionId: '1', optionText: 'Frontend development' },
      { optionId: '2', optionText: 'Server-side development' },
      { optionId: '3', optionText: 'Mobile app development' },
      { optionId: '4', optionText: 'Game development' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'Which module is used to create a web server in Node.js?',
    options: [
      { optionId: '1', optionText: 'fs' },
      { optionId: '2', optionText: 'path' },
      { optionId: '3', optionText: 'http' },
      { optionId: '4', optionText: 'url' }
    ],
    correctOption: '3'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'What is the correct way to create a server in Node.js?',
    options: [
      { optionId: '1', optionText: 'const server = http.createServer((req, res) => { res.end("Hello World"); });' },
      { optionId: '2', optionText: 'const server = http.create((req, res) => { res.end("Hello World"); });' },
      { optionId: '3', optionText: 'const server = http.startServer((req, res) => { res.end("Hello World"); });' },
      { optionId: '4', optionText: 'const server = http.newServer((req, res) => { res.end("Hello World"); });' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'What is the purpose of the "fs" module in Node.js?',
    options: [
      { optionId: '1', optionText: 'File system operations' },
      { optionId: '2', optionText: 'Network requests' },
      { optionId: '3', optionText: 'Database connections' },
      { optionId: '4', optionText: 'Event handling' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'Which method is used to read a file synchronously in Node.js?',
    options: [
      { optionId: '1', optionText: 'fs.readFile()' },
      { optionId: '2', optionText: 'fs.readFileSync()' },
      { optionId: '3', optionText: 'fs.read()' },
      { optionId: '4', optionText: 'fs.openFile()' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'What is the event-driven architecture in Node.js?',
    options: [
      { optionId: '1', optionText: 'A model where events trigger callbacks' },
      { optionId: '2', optionText: 'A database structure' },
      { optionId: '3', optionText: 'A frontend framework' },
      { optionId: '4', optionText: 'A type of variable' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'Which package manager is commonly used with Node.js?',
    options: [
      { optionId: '1', optionText: 'npm' },
      { optionId: '2', optionText: 'pip' },
      { optionId: '3', optionText: 'composer' },
      { optionId: '4', optionText: 'gem' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'What does the "require" function do in Node.js?',
    options: [
      { optionId: '1', optionText: 'Imports modules' },
      { optionId: '2', optionText: 'Declares variables' },
      { optionId: '3', optionText: 'Creates servers' },
      { optionId: '4', optionText: 'Handles errors' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'What is the purpose of the "process" object in Node.js?',
    options: [
      { optionId: '1', optionText: 'Provides information about the current Node.js process' },
      { optionId: '2', optionText: 'Manages database connections' },
      { optionId: '3', optionText: 'Handles HTTP requests' },
      { optionId: '4', optionText: 'Styles the application' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'Which module is used for URL parsing in Node.js?',
    options: [
      { optionId: '1', optionText: 'http' },
      { optionId: '2', optionText: 'url' },
      { optionId: '3', optionText: 'fs' },
      { optionId: '4', optionText: 'path' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Node.js',
    questionText: 'What is Express.js?',
    options: [
      { optionId: '1', optionText: 'A web framework for Node.js' },
      { optionId: '2', optionText: 'A database library' },
      { optionId: '3', optionText: 'A frontend library' },
      { optionId: '4', optionText: 'A testing tool' }
    ],
    correctOption: '1'
  },

  // Database Management Questions
  {
    topicTitle: 'Database Management',
    questionText: 'What does DBMS stand for?',
    options: [
      { optionId: '1', optionText: 'Database Management System' },
      { optionId: '2', optionText: 'Data Backup Management System' },
      { optionId: '3', optionText: 'Digital Base Management Setup' },
      { optionId: '4', optionText: 'Direct Base Main System' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'Which SQL command is used to retrieve data from a database?',
    options: [
      { optionId: '1', optionText: 'GET' },
      { optionId: '2', optionText: 'SELECT' },
      { optionId: '3', optionText: 'FETCH' },
      { optionId: '4', optionText: 'RETRIEVE' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'What is a primary key in a database?',
    options: [
      { optionId: '1', optionText: 'A unique identifier for a record' },
      { optionId: '2', optionText: 'A foreign key reference' },
      { optionId: '3', optionText: 'A type of index' },
      { optionId: '4', optionText: 'A database query' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'Which SQL command is used to add new data to a table?',
    options: [
      { optionId: '1', optionText: 'ADD' },
      { optionId: '2', optionText: 'INSERT' },
      { optionId: '3', optionText: 'UPDATE' },
      { optionId: '4', optionText: 'CREATE' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'What is normalization in database design?',
    options: [
      { optionId: '1', optionText: 'Organizing data to reduce redundancy' },
      { optionId: '2', optionText: 'Creating multiple databases' },
      { optionId: '3', optionText: 'Adding indexes to tables' },
      { optionId: '4', optionText: 'Backing up data' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'What is a foreign key?',
    options: [
      { optionId: '1', optionText: 'A field that links to another table’s primary key' },
      { optionId: '2', optionText: 'A unique identifier for a table' },
      { optionId: '3', optionText: 'A type of index' },
      { optionId: '4', optionText: 'A database backup' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'Which SQL command is used to modify existing data?',
    options: [
      { optionId: '1', optionText: 'ALTER' },
      { optionId: '2', optionText: 'UPDATE' },
      { optionId: '3', optionText: 'CHANGE' },
      { optionId: '4', optionText: 'MODIFY' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'What is a relational database?',
    options: [
      { optionId: '1', optionText: 'A database with tables related by keys' },
      { optionId: '2', optionText: 'A flat file database' },
      { optionId: '3', optionText: 'A NoSQL database' },
      { optionId: '4', optionText: 'A key-value store' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'What does ACID stand for in database transactions?',
    options: [
      { optionId: '1', optionText: 'Atomicity, Consistency, Isolation, Durability' },
      { optionId: '2', optionText: 'Accuracy, Control, Integrity, Durability' },
      { optionId: '3', optionText: 'Atomicity, Consistency, Integration, Dependability' },
      { optionId: '4', optionText: 'Availability, Control, Isolation, Dependability' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'Which SQL clause is used to filter results?',
    options: [
      { optionId: '1', optionText: 'SELECT' },
      { optionId: '2', optionText: 'WHERE' },
      { optionId: '3', optionText: 'FROM' },
      { optionId: '4', optionText: 'ORDER BY' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'What is a NoSQL database?',
    options: [
      { optionId: '1', optionText: 'A non-relational database' },
      { optionId: '2', optionText: 'A relational database' },
      { optionId: '3', optionText: 'A type of SQL command' },
      { optionId: '4', optionText: 'A database backup tool' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Database Management',
    questionText: 'Which SQL command is used to remove data from a table?',
    options: [
      { optionId: '1', optionText: 'DELETE' },
      { optionId: '2', optionText: 'REMOVE' },
      { optionId: '3', optionText: 'DROP' },
      { optionId: '4', optionText: 'ERASE' }
    ],
    correctOption: '1'
  },

  // System Design Questions
  {
    topicTitle: 'System Design',
    questionText: 'What is horizontal scaling?',
    options: [
      { optionId: '1', optionText: 'Adding more power to existing machines' },
      { optionId: '2', optionText: 'Adding more machines to the pool of resources' },
      { optionId: '3', optionText: 'Improving software algorithms' },
      { optionId: '4', optionText: 'Reducing system complexity' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is a load balancer used for?',
    options: [
      { optionId: '1', optionText: 'Distributing traffic across servers' },
      { optionId: '2', optionText: 'Storing data' },
      { optionId: '3', optionText: 'Encrypting data' },
      { optionId: '4', optionText: 'Caching data' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is vertical scaling?',
    options: [
      { optionId: '1', optionText: 'Adding more machines' },
      { optionId: '2', optionText: 'Increasing resources of a single machine' },
      { optionId: '3', optionText: 'Optimizing code' },
      { optionId: '4', optionText: 'Reducing latency' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is a microservices architecture?',
    options: [
      { optionId: '1', optionText: 'A system of independent services' },
      { optionId: '2', optionText: 'A single monolithic application' },
      { optionId: '3', optionText: 'A database structure' },
      { optionId: '4', optionText: 'A frontend framework' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is caching used for in system design?',
    options: [
      { optionId: '1', optionText: 'Storing frequently accessed data' },
      { optionId: '2', optionText: 'Encrypting data' },
      { optionId: '3', optionText: 'Backing up data' },
      { optionId: '4', optionText: 'Deleting data' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is the purpose of a CDN?',
    options: [
      { optionId: '1', optionText: 'Delivering content closer to users' },
      { optionId: '2', optionText: 'Managing databases' },
      { optionId: '3', optionText: 'Running servers' },
      { optionId: '4', optionText: 'Encrypting traffic' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is sharding in databases?',
    options: [
      { optionId: '1', optionText: 'Splitting data across multiple servers' },
      { optionId: '2', optionText: 'Combining multiple tables' },
      { optionId: '3', optionText: 'Encrypting data' },
      { optionId: '4', optionText: 'Backing up data' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is the CAP theorem?',
    options: [
      { optionId: '1', optionText: 'Consistency, Availability, Partition tolerance' },
      { optionId: '2', optionText: 'Control, Accuracy, Performance' },
      { optionId: '3', optionText: 'Consistency, Adaptability, Power' },
      { optionId: '4', optionText: 'Capacity, Availability, Precision' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is a reverse proxy?',
    options: [
      { optionId: '1', optionText: 'A server that forwards requests to other servers' },
      { optionId: '2', optionText: 'A database server' },
      { optionId: '3', optionText: 'A frontend framework' },
      { optionId: '4', optionText: 'A caching mechanism' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is the purpose of API gateways?',
    options: [
      { optionId: '1', optionText: 'Managing and routing API requests' },
      { optionId: '2', optionText: 'Storing API data' },
      { optionId: '3', optionText: 'Creating APIs' },
      { optionId: '4', optionText: 'Testing APIs' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'System Design',
    questionText: 'What is eventual consistency?',
    options: [
      { optionId: '1', optionText: 'Data consistency achieved over time' },
      { optionId: '2', optionText: 'Immediate data consistency' },
      { optionId: '3', optionText: 'A type of database' },
      { optionId: '4', optionText: 'A caching strategy' }
    ],
    correctOption: '1'
  },

  // Data Structures Questions
  {
    topicTitle: 'Data Structures',
    questionText: 'Which data structure follows LIFO (Last In First Out) principle?',
    options: [
      { optionId: '1', optionText: 'Queue' },
      { optionId: '2', optionText: 'Stack' },
      { optionId: '3', optionText: 'Array' },
      { optionId: '4', optionText: 'Linked List' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'What is a linked list?',
    options: [
      { optionId: '1', optionText: 'A sequence of nodes with pointers' },
      { optionId: '2', optionText: 'A fixed-size array' },
      { optionId: '3', optionText: 'A type of tree' },
      { optionId: '4', optionText: 'A hash table' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'Which data structure is used for fast key-value lookups?',
    options: [
      { optionId: '1', optionText: 'Array' },
      { optionId: '2', optionText: 'Hash Table' },
      { optionId: '3', optionText: 'Stack' },
      { optionId: '4', optionText: 'Queue' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'What is a binary tree?',
    options: [
      { optionId: '1', optionText: 'A tree with at most two children per node' },
      { optionId: '2', optionText: 'A linear data structure' },
      { optionId: '3', optionText: 'A type of array' },
      { optionId: '4', optionText: 'A key-value store' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'What is the time complexity of accessing an element in an array?',
    options: [
      { optionId: '1', optionText: 'O(1)' },
      { optionId: '2', optionText: 'O(n)' },
      { optionId: '3', optionText: 'O(log n)' },
      { optionId: '4', optionText: 'O(n²)' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'Which data structure follows FIFO (First In First Out) principle?',
    options: [
      { optionId: '1', optionText: 'Stack' },
      { optionId: '2', optionText: 'Queue' },
      { optionId: '3', optionText: 'Array' },
      { optionId: '4', optionText: 'Linked List' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'What is a hash table used for?',
    options: [
      { optionId: '1', optionText: 'Fast data retrieval' },
      { optionId: '2', optionText: 'Sorting data' },
      { optionId: '3', optionText: 'Traversing trees' },
      { optionId: '4', optionText: 'Managing stacks' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'What is a binary search tree?',
    options: [
      { optionId: '1', optionText: 'A tree where left child is smaller, right child is larger' },
      { optionId: '2', optionText: 'A tree with only one child per node' },
      { optionId: '3', optionText: 'A linear data structure' },
      { optionId: '4', optionText: 'A key-value store' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'What is the main advantage of a doubly linked list over a singly linked list?',
    options: [
      { optionId: '1', optionText: 'Bidirectional traversal' },
      { optionId: '2', optionText: 'Faster insertion' },
      { optionId: '3', optionText: 'Less memory usage' },
      { optionId: '4', optionText: 'Simpler implementation' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'What is a graph data structure?',
    options: [
      { optionId: '1', optionText: 'A collection of nodes and edges' },
      { optionId: '2', optionText: 'A linear data structure' },
      { optionId: '3', optionText: 'A type of array' },
      { optionId: '4', optionText: 'A stack-based structure' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Data Structures',
    questionText: 'What is the time complexity of inserting an element in a linked list?',
    options: [
      { optionId: '1', optionText: 'O(1)' },
      { optionId: '2', optionText: 'O(n)' },
      { optionId: '3', optionText: 'O(log n)' },
      { optionId: '4', optionText: 'O(n²)' }
    ],
    correctOption: '1'
  },

  // Algorithms Questions
  {
    topicTitle: 'Algorithms',
    questionText: 'What is the time complexity of binary search?',
    options: [
      { optionId: '1', optionText: 'O(n)' },
      { optionId: '2', optionText: 'O(log n)' },
      { optionId: '3', optionText: 'O(n²)' },
      { optionId: '4', optionText: 'O(1)' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is a sorting algorithm?',
    options: [
      { optionId: '1', optionText: 'An algorithm to arrange data in order' },
      { optionId: '2', optionText: 'An algorithm to search data' },
      { optionId: '3', optionText: 'An algorithm to compress data' },
      { optionId: '4', optionText: 'An algorithm to encrypt data' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is the time complexity of bubble sort?',
    options: [
      { optionId: '1', optionText: 'O(n)' },
      { optionId: '2', optionText: 'O(n²)' },
      { optionId: '3', optionText: 'O(log n)' },
      { optionId: '4', optionText: 'O(1)' }
    ],
    correctOption: '2'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is a recursive algorithm?',
    options: [
      { optionId: '1', optionText: 'An algorithm that calls itself' },
      { optionId: '2', optionText: 'An algorithm that loops infinitely' },
      { optionId: '3', optionText: 'An algorithm that sorts data' },
      { optionId: '4', optionText: 'An algorithm that searches data' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is the purpose of Dijkstra’s algorithm?',
    options: [
      { optionId: '1', optionText: 'Finding the shortest path in a graph' },
      { optionId: '2', optionText: 'Sorting an array' },
      { optionId: '3', optionText: 'Searching a list' },
      { optionId: '4', optionText: 'Compressing data' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is the time complexity of merge sort?',
    options: [
      { optionId: '1', optionText: 'O(n log n)' },
      { optionId: '2', optionText: 'O(n²)' },
      { optionId: '3', optionText: 'O(n)' },
      { optionId: '4', optionText: 'O(log n)' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is dynamic programming?',
    options: [
      { optionId: '1', optionText: 'Solving problems by breaking them into overlapping subproblems' },
      { optionId: '2', optionText: 'Writing dynamic code' },
      { optionId: '3', optionText: 'Sorting data dynamically' },
      { optionId: '4', optionText: 'Searching data dynamically' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is a greedy algorithm?',
    options: [
      { optionId: '1', optionText: 'An algorithm that makes locally optimal choices' },
      { optionId: '2', optionText: 'An algorithm that sorts data' },
      { optionId: '3', optionText: 'An algorithm that searches data' },
      { optionId: '4', optionText: 'An algorithm that compresses data' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is the time complexity of quicksort in the average case?',
    options: [
      { optionId: '1', optionText: 'O(n log n)' },
      { optionId: '2', optionText: 'O(n²)' },
      { optionId: '3', optionText: 'O(n)' },
      { optionId: '4', optionText: 'O(log n)' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is a depth-first search used for?',
    options: [
      { optionId: '1', optionText: 'Traversing or searching a graph' },
      { optionId: '2', optionText: 'Sorting an array' },
      { optionId: '3', optionText: 'Compressing data' },
      { optionId: '4', optionText: 'Encrypting data' }
    ],
    correctOption: '1'
  },
  {
    topicTitle: 'Algorithms',
    questionText: 'What is the purpose of the A* algorithm?',
    options: [
      { optionId: '1', optionText: 'Finding the shortest path with heuristics' },
      { optionId: '2', optionText: 'Sorting data' },
      { optionId: '3', optionText: 'Compressing data' },
      { optionId: '4', optionText: 'Searching a list' }
    ],
    correctOption: '1'
  }
];


// API configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api/v1';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to create a topic
async function createTopic(topic: Topic): Promise<string | null> {
  try {
    console.log(`Creating topic: ${topic.title} (${topic.difficulty})`);
    
    const response = await apiClient.post('/topics', topic);
    
    if (response.data.success && response.data.data) {
      console.log(`✅ Topic "${topic.title}" created with ID: ${response.data.data.id}`);
      return response.data.data.id;
    } else {
      console.error(`❌ Failed to create topic "${topic.title}":`, response.data);
      return null;
    }
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log(`⚠️  Topic "${topic.title}" already exists, skipping...`);
      return null;
    }
    console.error(`❌ Error creating topic "${topic.title}":`, error.response?.data || error.message);
    return null;
  }
}

// Function to add questions to a topic
async function addQuestions(topicId: string, questions: Question[]): Promise<boolean> {
  try {
    console.log(`Adding ${questions.length} questions to topic ID: ${topicId}`);
    
    const questionsWithTopicId = questions.map(q => ({
      ...q,
      topicId
    }));
    
    const response = await apiClient.post('/questions', {
      questions: questionsWithTopicId
    });
    
    if (response.data.success) {
      console.log(`✅ Successfully added ${questions.length} questions`);
      return true;
    } else {
      console.error(`❌ Failed to add questions:`, response.data);
      return false;
    }
  } catch (error: any) {
    console.error(`❌ Error adding questions:`, error.response?.data || error.message);
    return false;
  }
}

// Main seeding function
async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting database seeding...\n');
  
  try {
    // Test API connectivity
    console.log('🔍 Testing API connectivity...');
    await apiClient.get('/topics');
    console.log('✅ API is accessible\n');
  } catch (error: any) {
    console.error('❌ Cannot connect to API. Please ensure the server is running.');
    console.error('Error:', error.message);
    process.exit(1);
  }
  
  const topicIdMap: Map<string, string> = new Map();
  let successCount = 0;
  let errorCount = 0;
  
  // Step 1: Create all topics
  console.log('📚 Creating topics...\n');
  for (const topic of topics) {
    const topicId = await createTopic(topic);
    if (topicId) {
      topicIdMap.set(topic.title, topicId);
      successCount++;
    } else {
      errorCount++;
    }
    
    // Add delay between requests to avoid rate limiting
    await delay(500);
  }
  
  console.log(`\n📊 Topics Summary: ${successCount} created, ${errorCount} errors\n`);
  
  if (topicIdMap.size === 0) {
    console.log('⚠️  No topics were created. Checking existing topics...');
    try {
      const response = await apiClient.get('/topics');
      if (response.data.success && response.data.data) {
        const existingTopics = response.data.data;
        for (const existingTopic of existingTopics) {
          topicIdMap.set(existingTopic.title, existingTopic.id);
        }
        console.log(`✅ Found ${topicIdMap.size} existing topics`);
      }
    } catch (error) {
      console.error('❌ Failed to fetch existing topics');
      process.exit(1);
    }
  }
  
  // Step 2: Group questions by topic and add them
  console.log('❓ Adding questions...\n');
  const questionsByTopic: Map<string, Question[]> = new Map();
  
  // Group questions by topic title
  for (const questionData of questionsData) {
    const { topicTitle, ...question } = questionData;
    if (!questionsByTopic.has(topicTitle)) {
      questionsByTopic.set(topicTitle, []);
    }
    questionsByTopic.get(topicTitle)?.push(question);
  }
  
  let questionSuccessCount = 0;
  let questionErrorCount = 0;
  
  // Add questions for each topic
  for (const [topicTitle, questions] of questionsByTopic.entries()) {
    const topicId = topicIdMap.get(topicTitle);
    
    if (!topicId) {
      console.log(`⚠️  Skipping questions for "${topicTitle}" - topic not found`);
      questionErrorCount += questions.length;
      continue;
    }
    
    const success = await addQuestions(topicId, questions);
    if (success) {
      questionSuccessCount += questions.length;
    } else {
      questionErrorCount += questions.length;
    }
    
    // Add delay between requests
    await delay(500);
  }
  
  console.log(`\n📊 Questions Summary: ${questionSuccessCount} added, ${questionErrorCount} errors\n`);
  
  // Final summary
  console.log('🎉 Database seeding completed!');
  console.log(`📚 Topics: ${successCount} created`);
  console.log(`❓ Questions: ${questionSuccessCount} added`);
  
  if (errorCount > 0 || questionErrorCount > 0) {
    console.log(`⚠️  Errors: ${errorCount} topic errors, ${questionErrorCount} question errors`);
  }
}

// Run the seeding process
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n✅ Seeding process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedDatabase, topics, questionsData };