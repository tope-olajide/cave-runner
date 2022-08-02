# Caver Runner

Cave Runner is a 3D endless runner game built with Threejs. The player can use different characters to run, slide and jump through obstacles. The player will also be able to save and retrieve his or her game data online and compete with different players around the world with PlanetScale.

This project is my submission for the [PlanetScale Hackatkon on hashnode](https://hashnode.com/n/planetscalehackathon)
# Built with:
### [Threejs](https://threejs.org/)
Three.js is a powerful JavaScript library and API used to create and render 3d applications in the browser.
### [PlanetScale](https://planetscale.com/)
PlanetScale is an easy-to-use MySQL-compatible serverless database platform. 
### [Netlify](https://netlify.com/)
Netlify is a cloud computing company that offers hosting and serverless backend services for web applications and static websites.

### [Vite](https://vitejs.dev/)
Vite is an extremely fast JavaScript build tool for modern web projects. 
## Installation

Make sure you have [Nodejs](https://nodejs.org/) installed. I used version 16.16.0 to build this project.
Then clone the repo:

```bash
gh repo clone tope-olajide/cave-runner
```
navigate to the root directory on your CLI and run:
```bash
npm install
```
This will install all the project dependencies.

## Starting the Game with Vite
Yeah, it's possible to start the game now, without setting up the serverless functions but some features might not work locally and you won't be able connect to the PlanetScale's server to save the game's data. 

To start the game, without setting up the serverlss functions run the following command on your CLI:

```bash
npm run dev
```

# Starting the game with Netlify CLI and Connecting to PlanetScale

### Create a new database
- Signup for a new Account at [planetscale.com](https://planetscale.com)
- create a new database
- You need the database URL to connect to the server. To get the base URL, locate the `connect` button in your PlanetScale dashboard and click on it.
- Select Nodejs on the dropdown in front of the `connect with` options and copy the long URL strings under the `.env` tab. Copy the the string into you notepad.

### Creating the player's table in the Database

There's a console in your PlanetScale's dashboard, we're going to use it to create the players table. Copy and Paste the following SQL's Command:

``` sql
  CREATE TABLE `players` (
	`player_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`username` VARCHAR(255),
	`password`VARCHAR(255),
	`country` VARCHAR(255),
   `scores` INT DEFAULT 0,
   `coins` INT DEFAULT  0,
   `characters` TEXT
  );

```
The above command will create a new table called player.

### Creating the `.env`'s file

Next, you will create a `.env` file at root of the directory and add the following object to it:

```env
DATABASE_URL=add-the-database-url-string-you-copied-earlier-here
JWT_SECRET=add-your-jwt-secret-here
```

## Installing the Netlify's CLI

You need the Netlify CLI to test the serverless functions, run the project locally, and deploy to the server.

Install the Netlify CLI by running the following Command:
``` bash
npm install netlify-cli --global
```
Once Netlify has been installed, use the following command to login to your Netlify account, or create one if you don't have

``` bash
netlify login
```
Run the following command to connect the project with Netlify:

``` bash
netlify init
```
Finally, to start locally on your system run the following command:

```bash
netlify dev
```

This will launch the game on `localhost:8888`.

If you need to do more with the Netlify CLI,  [you can visit their docs for more information](https://docs.netlify.com/cli/get-started/).


## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.


## Contact

Temitope Olajide - [@your_twitter](https://twitter.com/your_username) - temitope_olajide@outlook.com

Project Link: [cave-runner.netlify.app](https://cave-runner.netlify.app)


## Acknowledgments

* [threejs](https:threejs.org)
* [hashnode](https://hashnode.com)
* [PlanetScale](https://planetscale.com)
* [netlify](https://netlify.app)
* [TypeScript](https://www.typescriptlang.org/)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)