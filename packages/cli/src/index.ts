#! /usr/bin/env node
import { Command } from 'commander'
import fs from 'fs-extra'
import { execa } from 'execa'
import inquirer from 'inquirer'


const program = new Command()

program.version('0.0.1').description('CLI for torque-ui')

program
    .command('init')
    .description('Initialize a new torque-ui project')
    .action(async () => {
        console.log('Initializing a new torque-ui project...')
        try {
            const torqueDir = './torque-ui'
            const configFile = './.torque-ui.json'

            //Detect package manager
            let packageManager = detectPackageManager()
            if (!packageManager) {
                const answer = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'packageManager',
                        message: 'Please select a package manager:',
                        choices: ['npm', 'yarn', 'pnpm'],
                    },
                ])
                packageManager = answer.packageManager
            }

            //  Save the choice
            await fs.writeJSON(configFile, { packageManager }, { spaces: 2 })
            console.log(`Using package manager: ${packageManager}`)

            // Create the torque-ui directory
            await fs.ensureDir(torqueDir)
            console.log(`Created directory: ${torqueDir}`)

            //  Install Tailwind CSS and dependencies
            console.log(`Installing dependencies with ${packageManager}...`)
            const installCmd = getInstallCommand(packageManager as 'npm' | 'yarn' | 'pnpm')
            await execa(installCmd.manager, installCmd.args, { stdio: 'inherit' })

            // Generate Tailwind CSS configuration files
            const tailwindConfig = `
            module.exports = {
            content: ["./torque-ui/**/*.{js,jsx,ts,tsx}"],
            theme: {
                extend: {},
                },
                plugins: [],
                }
            `.trim()
            await fs.writeFile('./tailwind.config.js', tailwindConfig)
            console.log('Generated tailwind.config.js')

            console.log('Project initialized successfully!')
        } catch (error) {
            console.error('Error initializing project:', error)
        }
    })

// Helper function to detect package manager
function detectPackageManager() {
    if (fs.existsSync('package-lock.json')) return 'npm'
    if (fs.existsSync('yarn.lock')) return 'yarn'
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
    return null
}

// Helper function to get install command based on package manager
function getInstallCommand(packageManager: 'npm' | 'yarn' | 'pnpm') {
    const packages = ['tailwindcss', 'postcss', 'autoprefixer']
    switch (packageManager) {
        case 'npm':
            return { manager: 'npm', args: ['install', '--save-dev', ...packages] }
        case 'yarn':
            return { manager: 'yarn', args: ['add', '--dev', ...packages] }
        case 'pnpm':
            return { manager: 'pnpm', args: ['add', '-D', ...packages] }
        default:
            throw new Error(`Unsupported package manager: ${packageManager}`)
    }
}

program
    .command('add <component>')
    .description('Add a new component to the project')
    .option('-d, --design <design>', 'Specify the design system to use', 'default')
    .action((component, options) => {
        console.log(`Adding a new component: ${component} with design ${options.design}`)
        // Add your component addition logic here
    })

program.parse(process.argv)
