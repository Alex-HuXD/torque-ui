#! /usr/bin/env node
import { Command } from 'commander'

const program = new Command()

program.version('0.0.1').description('CLI for torque-ui')

program
    .command('init')
    .description('Initialize a new torque-ui project')
    .action(() => {
        console.log('Initializing a new torque-ui project...')
        // Add your initialization logic here
    })

program
    .command('add <component>')
    .description('Add a new component to the project')
    .option('-d, --design <design>', 'Specify the design system to use', 'default')
    .action((component, options) => {
        console.log(`Adding a new component: ${component} with design ${options.design}`)
        // Add your component addition logic here
    })

program.parse(process.argv)
