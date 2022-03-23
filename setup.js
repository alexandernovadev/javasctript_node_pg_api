'use strict'

// el segundo parametro de un namespace
const debug = require('debug')('postgress_node_db:db:setup')

// Do question in promp terminal
const inquirer = require('inquirer')
const chalk = require('chalk') // Colors

const db = require('./')

// I/O
const prompt = inquirer.createPromptModule()

async function setup () {
  // DO questions

  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will detroy your database, are you sure ?'
    }
  ])

  if (!answer.setup) {
    return console.log('UFff, dont has remove nothing !! :D XD')
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'alex',
    password: process.env.DB_PASS || 'alex',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  // console.log('Success !')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`\n\n\n ${chalk.red('[fatal error]')} ${err.message}\n\n\n`)

  console.error(err.stack)
  process.exit(1)
}

setup()
