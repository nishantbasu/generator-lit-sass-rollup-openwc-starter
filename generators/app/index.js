import Generator from 'yeoman-generator';
import { execSync } from 'child_process';

export default class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.options['skipInstall'] = true;
    }

    initializing() {
        this.log('Welcome to the Lit Element Sass Rollup Generator!!');
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'install',
                message: 'Would you like to install dependencies? (y/n)',
                default: 'y',
                validate: input => /^(y|yes|n|no)$/i.test(input) || 'Please enter y or n',
            },
        ]);

        if (this._isAffirmative(this.answers.install)) {
            Object.assign(this.answers, await this.prompt([
                {
                    type: 'input',
                    name: 'build',
                    message: 'Would you like to build the project? (y/n)',
                    default: 'y',
                    validate: input => /^(y|yes|n|no)$/i.test(input) || 'Please enter y or n',
                },
            ]));
            if (this._isAffirmative(this.answers.build)) {
                Object.assign(this.answers, await this.prompt([
                    {
                        type: 'input',
                        name: 'serve',
                        message: 'Would you like to start the app? (y/n)',
                        default: 'y',
                        validate: input => /^(y|yes|n|no)$/i.test(input) || 'Please enter y or n',
                    },
                ]));
            }
        }
    }

    writing() {
        this.log('Copying template files...');
        const filesToCopy = [
            'tsconfig.json',
            'web-test-runner.config.mjs',
            'web-dev-server.config.mjs',
            'rollup.config.mjs',
            'README.template.md',
            'README.md',
            'postcss.config.mjs',
            'package.json',
            'package-lock.json',
            'eslint.config.mjs',
            '.prettierrc',
            '.gitignore',
            'web-dev-server',
            'demo',
            'src',
        ];

        filesToCopy.forEach(file => {
            if (file === '.gitignore') {
                this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
            } else {
                this.fs.copy(this.templatePath(file), this.destinationPath(file));
            }
        });
        this.log('Files copied successfully.');
    }

    install() {
        this._installDependencies();
    }

    _installDependencies() {
        if (this._isAffirmative(this.answers.install)) {
            this.log('Installing dependencies...');
            try {
                execSync('npm i', { stdio: 'inherit' });
                this.log('Dependencies installed successfully.');

                if (this._isAffirmative(this.answers.build)) {
                    this.log('Building the project...');
                    try {
                        execSync('npm run build', { stdio: 'inherit' });
                        this.log('Project built successfully.');

                        if (this._isAffirmative(this.answers.serve)) {
                            this.log('Starting the app...');
                            try {
                                execSync('npm run serve', { stdio: 'inherit' });
                                this.log('App started successfully.');
                            } catch (error) {
                                this.log(`Error starting the app: ${error.message}`);
                            }
                        }
                    } catch (error) {
                        this.log(`Error building the project: ${error.message}`);
                    }
                }
            } catch (error) {
                this.log(`Error installing dependencies: ${error.message}`);
            }
        } else {
            this.log('Skipping dependency installation.');
        }
    }

    _isAffirmative(response) {
        return /^(y|yes)$/i.test(response);
    }

    end() {
        this.log('\nFinished generating!\n');
    }
}
