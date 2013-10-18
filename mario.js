/*
	CHANGELOG:
		11/09:
			- Fonction d'initialisation et rendu graphique commencée
			- Pixelisation de Mario et d'une brique
			- Ajout du déplacement du 'path'
			
			- Abandon de la génération aléatoire de la route pour des 'sessions', plus simple à gérer et plus sûr
	
	TODO:
		- Ajouter la 'gravité'
		- Gérer la position du 'path'
	
*/
( function(){
	var game = {
		init : function(){
			// Application des styles de 'body'
				document.body.style.width = "1000px";
				document.body.style.margin = "0 auto";
			// Création du Canvas
				canvas = document.createElement('canvas');
				ctx = canvas.getContext('2d');
			// Application des styles du canvas
				canvas.style.border = "1px solid black";
				ctx.canvas.width = 1000;
				ctx.canvas.height = 323;
				
			// Mise en place du canvas
				document.body.appendChild(canvas);
			
			// Variable de Jeu
				game.play = 1;
				game.speed = 10; 	// Image/Sec
				game.level = 3; 	// Niveau de difficulté du 'path'
				
				// Initialisation du 'path'
					game.path = {};
					game.path.type = "";
					game.path.position = "";
		},
		start: function(){
			i = 0;
			game.run = setInterval( function(){
				graph.clearAll();
					
					// Génération de Mario
					graph.generate(texture.mario[i%4],16,27,texture.mario.x,texture.mario.y);
					
					// Ajout de nouvelle session au 'path' s'il est trop petit
					while(game.path.type.length < 64){ // 36 -> nombre minimum de case nécessaire pour remplir l'écran
						// Choisir une nouvelle session à ajouter au path de manière aléatoire
						var rand = Math.floor(Math.random() * (path.type[game.level].length));
							game.path.type += path.type[game.level][rand];
							game.path.position += path.position[game.level][rand];
					}
					
					var loop = 0;
					while(loop < 64){
						var pos = (game.path.position[loop] * 27) + 40;
						graph.generate(texture.obstacle[game.path.type[loop]],16,28,1000 - loop * 16,pos);
						loop++;
					}
				
				game.path.type = game.path.type.substr(1,game.path.type.length);
				game.path.position = game.path.position.substr(1,game.path.type.length);
				i++;
				
				if(texture.mario.y >= ((game.path.position[0] * 27) + 40)) game.stop();
			},1000/game.speed);
		},
		stop: function(){
			clearInterval(game.run);
			console.log("Game Over !!");
		}
	};
	
	// Générateur de Pixel
	var graph = {
		generate : function(imgPreData,width,height,x = 0,y = 0){
				imgData = ctx.createImageData(width,height);
				for( var i = 0; i < imgData.data.length; i+=4){
					imgData.data[i+3] = 1 << imgPreData[i/4];
				}
				ctx.putImageData(imgData,x,y);
		},
		clear : function(x1,y1,x2,y2){
			var width = x2 - x1;
			var height = y2 - y1;
			if(width <= 0) console.log("[Error]: On graph.clear - Width can't be negative.");
			if(height <= 0) console.log("[Error]: On graph.clear - Height can't be negative.");

			ctx.clearRect(x1,y1,width,height);
		},
		clearAll: function(){
			ctx.clearRect(0,0,1000,800);
			return "graph.clearAll: Done";
		}
	};
	
	// Décors pixelisés
	var texture = {
		obstacle : {
			0:"888888888888888880000000880000088000000088000008800000008800000880000000888000088000000080888880800000008888888880000000880000088000000088000008800000008800000888000000880000088888000088000008808888888000000880008888800000088000000880000088888888808888888088888888888888808000000008800008800000000880000880000000088000088000000008880008800000000808888080000000088888888888888888888888",
			1:"0000000000000000",
			x: [
				968
			],
			y: [
				580
			]
		},
		mario : {
			// Width: 16	Height: 27
			0:"0000888880000000000888888880000000088888888800000088888888888000088888888888880008888888888888800088008008888880008808880888888000880888088888800088888888888888008888888888888800888888888888800888888888888880008888888888880008888888888888808080888888888888800808888888888880088888888888880888888888880088008888888800000808888888880000088888888888800080888888888888888088888888888888880888800008888888008800000008888800000000000008800000000000000000",
			1:"0000888880000000000888888880000000088888888800000088888888888000088888888888880008888888888888800088008008888880008808880888888000880888088888800088888888888888008888888888888800888888888888800888888888888880000088888888800000000888888880000000888888888800008888888008888008088880000088800888888000008880008888880008880000888888888888000088888888888000088888888888880088888888888888808888880888888880888888000888888008888800888888000008800088888000",
			2:"0000888880000000000888888880000000088888888800000088888888888000088888888888880008888888888888800088008008888880008808880888888000880888088888800088888888888888008888888888888800888888888888800888888888888880000888888888800000008888888800000008000888888000008000008888880000800000888888000008000888888800000088888888880000088888888888000008888888888800000088888888800000008888888880000000088888880000000088888888000000088888888800000008888888880000",
			3:"0000888880000000000888888880000000088888888800000088888888888000088888888888880008888888888888800088008008888880008808880888888000880888088888800088888888888888008888888888888800888888888888800888888888888880000088888888800000000888888880000000888888888800008888888008888008088880000088800888888000008880008888880008880000888888888888000088888888888000088888888888880088888888888888808888880888888880888888000888888008888800888888000008800088888000",
			x: 968,
			y: 121
		}
	};
	
	// Différent 'path' possible
	var path = {
		type : {
			1: [ "0000000000000000" ],
			2: [ "000000000000000011000000" ],
			3: [ "000011000000000011000000" , "00001100" ]
		},
		position : {
			1: [ "5555555555555555" ],
			2: [ "444444445555555599444444" ],
			3: [ "555599554444444499333333" , "55559955"]
		}
	}
	
	game.init();
	game.start();
}()
)