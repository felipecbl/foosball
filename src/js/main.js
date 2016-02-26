(function(){

// JS OOP

// Player
var Player = function(id, name){
    this.id             = id;
    this.name           = name;
    this.matchesPlayed  = 0;
    this.victories      = 0;
    this.scoreBalance   = 0;
};

// increment a victory point
Player.prototype.wins = function() {
	this.victories++;
};

// add scores for the scoreBalance property
Player.prototype.addScores = function(points) {
	this.scoreBalance = this.scoreBalance + points;
};

// increment the number of matches played
Player.prototype.played = function() {
	this.matchesPlayed++;
};


// Team
var Team = function(id, offensePlayer, defensePlayer){
    this.id             = id;
    this.offensePlayer  = offensePlayer;
    this.defensePlayer  = defensePlayer;
};

// Match
var Match = function(id, homeTeam, awayTeam){
    this.id             = id;
    this.homeTeam       = homeTeam;
    this.awayTeam       = awayTeam;

    this.homeTeamScore  = 0;
    this.awayTeamScore  = 0;
    this.winner         = null;
};

// Championship
var Championship = function(id, name, type, tournamentType, matches){
    this.id                 = id;
    this.name               = name;
    this.type               = type;
    this.tournamentType     = tournamentType;
    this.matches            = matches;
    this.date               = Date.now();
};



var Foos = {
	init: function(){
		var self = this;

        self.players    = [];
        self.teams      = [];
        self.matches    = [];

		self.addPlayers();
		self.generateTable();
	},

	addPlayers: function(){
		var self = this,
			bt = $('#add-button'),
			playersList = [];

		bt.on('click', function(event) {
			var playersInput = $('#players-input').val().toLowerCase();

			event.preventDefault();

			tempList = playersInput.split(',');

			$.each(tempList, function(index, val) {
				// removing starting and ending spaces
				if ( playersList.indexOf($.trim(tempList[index])) == -1 ) {
					playersList[index] = $.trim(tempList[index]);
				}
			});

			$.each(self.players, function(index, val) {
				if ( playersList.indexOf(val.name) == -1 ) {
					playersList.push($.trim(val.name));
				}
			});

			playersList.sort(function() { return 0.5 - Math.random(); });

			self.players = [];

			$.each(playersList, function(index, val) {

				var newPlayer = new Player(index + 1, $.trim(val));
				self.players.push(newPlayer);
			});

			self.generatelist();
		});
	},

	generatelist: function(){
		var self = this,
			html = '',
			hList = $('.players-list ul');

		$.each(self.players, function(index, player) {
			html += '<li data-playerid="' + player.id + '">' + player.name + '<i class="fa fa-trash delete-player"></i></li>';
		});

		hList.html(html);

		var trash = $('.delete-player');

		trash.on('click', function(event) {
			var playerId = $(this).parent('[data-playerid]').attr('data-playerid');

			self.deletePlayer(playerId);
		});
	},

	deletePlayer: function(playerId){
		var self = this,
			removeIt;

		$.each(self.players, function(index, player) {
			// console.log(player.playerId, playerId);
			if (player.id == playerId) {
				removeIt = index;
			}
		});

		self.players.splice(removeIt, 1);

		self.generatelist();
	},

	generateTable: function(){
		var self = this,
			bt = $('#generate'),
			playersTable = $('.players-table');

		bt.on('click', function(event) {
			var championshipName = $('#championship-name').val() || 'Championship';

			event.preventDefault();

			self.makeTeams();
			self.makeMatches();

			console.log(self.teams[0].length);

			var html = '<h1>' + championshipName +'</h1>';

			$.each(self.matches, function(roundIndex, round) {
				html += '<ul class="round">';

				if ((self.matches).length > 1) {
					html += '<h2>Round ' + (roundIndex + 1) + '</h2>';
				}

				$.each(round, function(teamIndex, match) {
					html +=
					'<li>' +
						'<div class="home-team">' +
							'<a href="#" class="player-offense"  title="' + match.homeTeam.offensePlayer.name + '" data-playerid="' + match.homeTeam.offensePlayer.id +'">' + match.homeTeam.offensePlayer.id + '</a>' +
							'<a href="#" class="player-offense"  title="' + match.homeTeam.defensePlayer.name + '" data-playerid="' + match.homeTeam.defensePlayer.id +'">' + match.homeTeam.defensePlayer.id + '</a>' +
						'</div>' +
						'<div> x </div>' +
						'<div class="away-team">' +
							'<a href="#" class="player-offense"  title="' + match.awayTeam.offensePlayer.name + '" data-playerid="' + match.awayTeam.offensePlayer.id +'">' + match.awayTeam.offensePlayer.id + '</a>' +
							'<a href="#" class="player-offense"  title="' + match.awayTeam.defensePlayer.name + '" data-playerid="' + match.awayTeam.defensePlayer.id +'">' + match.awayTeam.defensePlayer.id + '</a>' +
						'</div>' +
					'</li>';
				});
				html += '</ul>';
			});

			playersTable.html(html);
		});
	},

	makeTeams: function(){
		var self = this,
            gamePlayersX        = self.players,
            gamePlayersY        = self.players,
            nextId              = 1;

		// reset teams
		self.teams = [];
		self.teams[0] = [];

		$.each(gamePlayersX, function(xIndex, offensePlayer) {
			$.each(gamePlayersY, function(yIndex, defensePlayer) {

				// create team if offensive and defesive are not the same player
				if (offensePlayer != defensePlayer) {
					var newTeam = new Team(nextId, offensePlayer, defensePlayer);

					self.teams[0].push(newTeam);

					// set next Id
					nextId++;
				}
			});
		});
	},

	makeMatches: function(){
		var self = this;

		// reset games
		self.matches = [];

		$.each(self.teams, function(roundIndex, teams) {
            var roundTeams      = teams.slice(),
                matchId         = 1,
                addedTeams      = [],
                remainingTeams  = teams.length,
                halfIndex       = (teams.length / 2);

			self.matches[roundIndex] = [];

			while(addedTeams.length != teams.length){
				var homeTeamIndex = 0,
                	homeTeamIndex2  = halfIndex;

                ////////////////
                // first half //
                ////////////////

				while(addedTeams.indexOf(teams[homeTeamIndex]) != -1){
					homeTeamIndex++;

		 			if (homeTeamIndex > teams.length) {
		 				break;
		 			}
				}

				var homeTeam = teams[homeTeamIndex],
					awayTeam;

				addedTeams.push(homeTeam);

				for (var i = teams.length - 1; i > halfIndex; i--) {
					if(addedTeams.indexOf(teams[i]) == -1){
						awayTeam = teams[i];

						if (homeTeam.id                  != awayTeam.id              &&
						    homeTeam.offensePlayer       != awayTeam.offensePlayer   &&
						    homeTeam.offensePlayer       != awayTeam.defensivePlayer &&
						    homeTeam.defensePlayer       != awayTeam.offensePlayer   &&
						    homeTeam.defensePlayer       != awayTeam.defensePlayer ) {

							addedTeams.push(awayTeam);
							break;
						}
					}
				}

				var newMatch = new Match(matchId++, homeTeam, awayTeam);

				self.matches[roundIndex].push(newMatch);

				/////////////////
				// second half //
				/////////////////

		 		while(addedTeams.indexOf(teams[homeTeamIndex2]) != -1){
		 			homeTeamIndex2++;

		 			if (homeTeamIndex2 > teams.length) {
		 				break;
		 			}
		 		}

				var homeTeam2 = teams[homeTeamIndex2],
					awayTeam2;

				addedTeams.push(homeTeam2);

				for (var i2 = halfIndex; i2 > 0; i2--) {
					if (addedTeams.indexOf(teams[i2]) == -1) {

						awayTeam2 = teams[i2];

						if (homeTeam2.id                  != awayTeam2.id              &&
						    homeTeam2.offensePlayer       != awayTeam2.offensePlayer   &&
						    homeTeam2.offensePlayer       != awayTeam2.defensivePlayer &&
						    homeTeam2.defensePlayer       != awayTeam2.offensePlayer   &&
						    homeTeam2.defensePlayer       != awayTeam2.defensePlayer ) {

							addedTeams.push(awayTeam2);
							break;
						}
					}
				}

				var newMatch2 = new Match(matchId++, homeTeam2, awayTeam2);

				self.matches[roundIndex].push(newMatch2);
			}
		});
	}
};

Foos.init();

})();
