(function (Kotlin) {
  'use strict';
  var _ = Kotlin.defineRootPackage(null, /** @lends _ */ {
    org: Kotlin.definePackage(null, /** @lends _.org */ {
      darkpaw: Kotlin.definePackage(null, /** @lends _.org.darkpaw */ {
        ld33: Kotlin.definePackage(function () {
          this.canvas = _.org.darkpaw.ld33.initalizeCanvas();
        }, /** @lends _.org.darkpaw.ld33 */ {
          Pixel: Kotlin.createClass(null, function (context) {
            this.context = context;
            this.height = _.org.darkpaw.ld33.canvas.height;
            this.width = _.org.darkpaw.ld33.canvas.width;
            this.hue = 0;
          }, /** @lends _.org.darkpaw.ld33.Pixel.prototype */ {
            pixel: function (x, y, colour, pxsize) {
              this.context.save();
              this.context.beginPath();
              this.context.lineWidth = pxsize;
              this.context.moveTo(x, y);
              this.context.lineTo(x + pxsize, y);
              this.context.strokeStyle = 'RGB(' + colour.R + ', ' + colour.G + ', ' + colour.B + ')';
              this.context.shadowColor = 'black';
              this.context.shadowBlur = 3.0;
              this.context.shadowOffsetX = 1.0;
              this.context.shadowOffsetY = 1.0;
              this.context.stroke();
              this.context.restore();
            }
          }),
          Audio: Kotlin.createClass(null, function (world) {
            this.world = world;
            this.sounds = new Kotlin.DefaultPrimitiveHashMap();
          }, /** @lends _.org.darkpaw.ld33.Audio.prototype */ {
            loadSample: function (name, path) {
              var sound = window.document.createElement('audio');
              sound.src = path;
              sound.loop = false;
              this.sounds.put_wn2jw4$(name, sound);
              return sound;
            },
            play: function (name) {
              var tmp$0;
              var sound = (tmp$0 = this.sounds.get_za3rmp$(name)) != null ? tmp$0 : Kotlin.throwNPE();
              Kotlin.println('audio is muted - ' + name);
            }
          }),
          GameWorld: Kotlin.createClass(null, function (context) {
            this.context = context;
            this.height = _.org.darkpaw.ld33.canvas.height;
            this.width = _.org.darkpaw.ld33.canvas.width;
            this.image_data = new Kotlin.DefaultPrimitiveHashMap();
            this.audio = new _.org.darkpaw.ld33.Audio(this);
            this.background_pixels = new _.org.darkpaw.ld33.effects.RandomPixels(context);
            this.grid_effect = new _.org.darkpaw.ld33.effects.Grid(context);
            this.boss_mob = new _.org.darkpaw.ld33.mobs.BossMob(this, new _.org.darkpaw.ld33.sprites.RooSprite(context));
            this.boss_bullet = new _.org.darkpaw.ld33.mobs.BossBullet(this, new _.org.darkpaw.ld33.sprites.BulletSprite(context));
            this.player_bullet_sprite = new _.org.darkpaw.ld33.sprites.PlayerBulletSprite(context);
            this.player_bullets = Kotlin.modules['stdlib'].kotlin.arrayListOf_9mqe4v$([]);
            this.splash_screen = false;
            this.bullet_pos = new _.org.darkpaw.ld33.Vector(0.0, 0.0);
            this.bullet_delta = new _.org.darkpaw.ld33.Vector(-7.0, 0.0);
            this.target_fps = 20;
            this.frame_count = Kotlin.Long.ZERO;
            this.game_over = false;
            this.image_data.put_wn2jw4$('background', _.org.darkpaw.ld33.getImage('img/background.003.png'));
            this.audio.loadSample('boss_shoot', 'snd/boss_shoot.002.ogg');
            this.audio.loadSample('player_shoot', 'snd/player_shoot.ogg');
            this.player = new _.org.darkpaw.ld33.mobs.PlayerMob(this, new _.org.darkpaw.ld33.sprites.PlayerSprite(context));
            this.player.lives = 5;
          }, /** @lends _.org.darkpaw.ld33.GameWorld.prototype */ {
            game_over_1: function () {
              if (this.boss_mob.HP < 1)
                return true;
              if (this.player.lives < 1)
                return true;
              return false;
            },
            boss_fire_click: function (v) {
              if (this.game_over_1()) {
                this.player.reset();
                this.player.lives = 5;
                this.boss_mob.reset();
                this.frame_count = Kotlin.Long.ZERO;
              }
              if (!this.boss_mob.reloading) {
                this.audio.play('boss_shoot');
                this.boss_mob.fire();
                var boss_size_px = this.boss_mob.sprite.size_on_screen;
                this.bullet_pos = new _.org.darkpaw.ld33.Vector(this.boss_mob.position.x - boss_size_px * 0.9, this.boss_mob.position.y - boss_size_px * 0.75);
                this.boss_bullet.fire(this.bullet_pos, this.frame_count);
              }
            },
            register_hit_boss: function () {
              Kotlin.println('Ouch!');
              this.boss_mob.HP = this.boss_mob.HP - 37;
            },
            register_hit_player: function () {
              Kotlin.println('Good shot!');
              this.player.reset();
              this.player.lives = this.player.lives - 1;
            },
            player_fire: function (pos) {
              var b = new _.org.darkpaw.ld33.mobs.PlayerBullet(this, this.player_bullet_sprite, pos, this.frame_count);
              this.player_bullets.add_za3rmp$(b);
              this.audio.play('player_shoot');
            },
            draw_stuff: function () {
              var tmp$0, tmp$1, tmp$2, tmp$3, tmp$4;
              tmp$0 = this.frame_count, tmp$1 = tmp$0, this.frame_count = tmp$0.inc(), tmp$1;
              this.player.move(this.frame_count);
              this.boss_mob.move(this.frame_count);
              if (Kotlin.equals(this.boss_bullet.move(this.frame_count), false)) {
                this.boss_bullet.visible = false;
              }
              tmp$2 = this.player_bullets.iterator();
              while (tmp$2.hasNext()) {
                var b = tmp$2.next();
                var result = b.move(this.frame_count);
                if (Kotlin.equals(result, false))
                  this.player_bullets.remove_za3rmp$(b);
              }
              this.context.fillStyle = 'rgba(0.08,0.17,0.24,0.80)';
              this.context.fillRect(0.0, 0.0, this.width, this.height);
              var bg_img = (tmp$3 = this.image_data.get_za3rmp$('background')) != null ? tmp$3 : Kotlin.throwNPE();
              this.context.drawImage(bg_img, 0.0, 0.0);
              this.boss_bullet.draw(this.frame_count);
              this.boss_mob.draw();
              tmp$4 = this.player_bullets.iterator();
              while (tmp$4.hasNext()) {
                var b_0 = tmp$4.next();
                b_0.draw(this.frame_count);
              }
              this.player.draw();
              this.context.font = '48px LiquidCrystal';
              this.context.fillStyle = 'silver';
              this.context.textBaseline = 'top';
              this.context.fillText(this.frame_count.modulo(Kotlin.Long.fromInt(this.boss_mob.cycle_time)).toString(), 40.0, 460.0);
              this.context.fillStyle = 'aqua';
              this.context.fillText(this.boss_mob.HP.toString(), 640.0, 10.0);
              this.context.fillStyle = 'light green';
              this.context.fillText('Lives: ' + this.player.lives, 40.0, 10.0);
              if (this.boss_mob.reloading) {
                this.boss_mob.sprite.show_reloading(true);
                this.context.font = '48px LiquidCrystal';
                this.context.fillStyle = 'orangered';
                this.context.textBaseline = 'top';
                this.context.fillText('RELOADING', 540.0, 375.0);
              }
               else {
                if (Math.random() < 0.2) {
                  this.boss_mob.sprite.flicker_tail();
                }
                this.boss_mob.sprite.show_reloading(false);
              }
              if (this.game_over_1()) {
                this.context.fillStyle = 'rgba(0,0,0,0.45)';
                this.context.fillRect(0.0, 0.0, this.width, this.height);
                this.grid_effect.gridify();
                this.background_pixels.pixellate();
              }
            },
            run: function () {
              window.setInterval(_.org.darkpaw.ld33.GameWorld.run$f(this), 1000 / this.target_fps | 0);
            }
          }, /** @lends _.org.darkpaw.ld33.GameWorld */ {
            run$f: function (this$GameWorld) {
              return function () {
                this$GameWorld.draw_stuff();
              };
            }
          }),
          PixelSprite: Kotlin.createClass(null, function (context, size, px_spacing) {
            this.size = size;
            this.context = context;
            this.pixels = Kotlin.numberArrayOfSize(size * size * 3);
            this.pxsize = px_spacing * 0.8;
            this.px_spacing = px_spacing;
          }, /** @lends _.org.darkpaw.ld33.PixelSprite.prototype */ {
            size_on_screen: {
              get: function () {
                return this.size * this.px_spacing;
              }
            },
            draw_z3hs27$: function (v) {
              var tmp$0, tmp$1;
              var p = new _.org.darkpaw.ld33.Pixel(this.context);
              tmp$0 = this.size - 1;
              for (var x = 0; x <= tmp$0; x++) {
                tmp$1 = this.size - 1;
                for (var y = 0; y <= tmp$1; y++) {
                  var pix_idx = (y * 32 + x) * 4;
                  var canvas_x = x * this.px_spacing + v.x;
                  var canvas_y = y * this.px_spacing + v.y;
                  var colour = new _.org.darkpaw.ld33.RGBA(this.pixels[pix_idx], this.pixels[pix_idx + 1], this.pixels[pix_idx + 2], this.pixels[pix_idx + 3]);
                  if (colour.A !== 0) {
                    p.pixel(canvas_x, canvas_y, colour, this.pxsize);
                  }
                }
              }
            },
            randomise: function () {
              var tmp$0;
              tmp$0 = this.size * this.size * 4 - 1;
              for (var i = 0; i <= tmp$0; i++) {
                this.pixels[i] = 255 * Math.random() | 0;
              }
            },
            clear_to_alpha_za3lpa$: function (alpha) {
              var tmp$0;
              tmp$0 = this.size * this.size * 4 - 1;
              for (var i = 0; i <= tmp$0; i++) {
                if (i % 4 === 0) {
                  this.pixels[i] = alpha;
                }
                 else {
                  this.pixels[i] = 0;
                }
              }
            },
            setpx_pfysp4$: function (pxidx, colour) {
              this.pixels[pxidx] = colour.R;
              this.pixels[pxidx + 1] = colour.G;
              this.pixels[pxidx + 2] = colour.B;
              this.pixels[pxidx + 3] = colour.A;
            }
          }),
          RGBA: Kotlin.createClass(null, function (R, G, B, A) {
            this.R = R;
            this.G = G;
            this.B = B;
            this.A = A;
          }),
          initalizeCanvas: function () {
            var tmp$0;
            var canvas = (tmp$0 = document.getElementById('main_canvas')) != null ? tmp$0 : Kotlin.throwNPE();
            return canvas;
          },
          v: function (x, y) {
            return new _.org.darkpaw.ld33.Vector(x, y);
          },
          main$f: function () {
            var tmp$0;
            var context = (tmp$0 = _.org.darkpaw.ld33.canvas.getContext('2d')) != null ? tmp$0 : Kotlin.throwNPE();
            var world = new _.org.darkpaw.ld33.GameWorld(context);
            new _.org.darkpaw.ld33.CanvasEvents(_.org.darkpaw.ld33.canvas, world);
            world.run();
          },
          main: function (args) {
            var tmp$0;
            Kotlin.println('Startup!');
            try {
              ((tmp$0 = document.getElementById('title')) != null ? tmp$0 : Kotlin.throwNPE()).innerHTML = 'Kotlin Javascript and HTML5 Canvas Test';
            }
             catch (e) {
              if (Kotlin.isType(e, Kotlin.NullPointerException)) {
                Kotlin.println('Whoops, the HTML is missing the title element?');
              }
               else
                throw e;
            }
            $(_.org.darkpaw.ld33.main$f);
          },
          getImage: function (path) {
            var image = window.document.createElement('img');
            image.src = path;
            return image;
          },
          Vector: Kotlin.createClass(null, function (x, y) {
            if (x === void 0)
              x = 0.0;
            if (y === void 0)
              y = 0.0;
            this.x = x;
            this.y = y;
          }, /** @lends _.org.darkpaw.ld33.Vector.prototype */ {
            plus: function (v) {
              return _.org.darkpaw.ld33.v(this.x + v.x, this.y + v.y);
            },
            minus: function () {
              return _.org.darkpaw.ld33.v(-this.x, -this.y);
            },
            minus_1: function (v) {
              return _.org.darkpaw.ld33.v(this.x - v.x, this.y - v.y);
            },
            times: function (koef) {
              return _.org.darkpaw.ld33.v(this.x * koef, this.y * koef);
            },
            distanceTo: function (v) {
              return Math.sqrt(this.minus_1(v).sqr);
            },
            rotatedBy: function (theta) {
              var sin = Math.sin(theta);
              var cos = Math.cos(theta);
              return _.org.darkpaw.ld33.v(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
            },
            toString: function () {
              return '(' + this.x + ', ' + this.y + ')';
            },
            isInRect: function (topLeft, size) {
              return this.x >= topLeft.x && this.x <= topLeft.x + size.x && this.y >= topLeft.y && this.y <= topLeft.y + size.y;
            },
            sqr: {
              get: function () {
                return this.x * this.x + this.y * this.y;
              }
            },
            normalized: {
              get: function () {
                return this.times(1.0 / Math.sqrt(this.sqr));
              }
            }
          }),
          CanvasEvents: Kotlin.createClass(null, function (canvas, world) {
            this.canvas = canvas;
            this.world = world;
            $(this.canvas).mousedown(_.org.darkpaw.ld33.CanvasEvents.CanvasEvents$f(this));
          }, /** @lends _.org.darkpaw.ld33.CanvasEvents.prototype */ {
            mousePos: function (e) {
              var offset = new _.org.darkpaw.ld33.Vector();
              var element = this.canvas;
              while (element != null) {
                var el = element;
                offset = offset.plus(new _.org.darkpaw.ld33.Vector(el.offsetLeft, el.offsetTop));
                element = el.offsetParent;
              }
              return (new _.org.darkpaw.ld33.Vector(e.pageX, e.pageY)).minus_1(offset);
            }
          }, /** @lends _.org.darkpaw.ld33.CanvasEvents */ {
            CanvasEvents$f: function (this$CanvasEvents) {
              return function (it) {
                var mousePos = this$CanvasEvents.mousePos(it);
                Kotlin.println('mouse down at (' + mousePos.x + ', ' + mousePos.y + ')');
                this$CanvasEvents.world.boss_fire_click(mousePos);
              };
            }
          }),
          mobs: Kotlin.definePackage(null, /** @lends _.org.darkpaw.ld33.mobs */ {
            ActionTimer: Kotlin.createClass(null, function () {
              this.timer_frames = 0.0;
              this.expired = false;
            }, /** @lends _.org.darkpaw.ld33.mobs.ActionTimer.prototype */ {
              tick: function () {
                if (this.timer_frames < 0.0)
                  this.expired = true;
                this.timer_frames -= 1;
              },
              set: function (duration) {
                this.timer_frames = duration;
                this.expired = false;
              }
            }),
            PlayerBullet: Kotlin.createClass(null, function (gw, sprite, fired_from, fired_at) {
              this.sprite = sprite;
              this.game_world = gw;
              this.speed = 16.0;
              this.fired_from_position = fired_from;
              this.fired_at = fired_at;
            }, /** @lends _.org.darkpaw.ld33.mobs.PlayerBullet.prototype */ {
              current_position: function (frame_count) {
                var travelled = frame_count.subtract(this.fired_at).toNumber() * this.speed;
                var current_position = new _.org.darkpaw.ld33.Vector(this.fired_from_position.x + travelled, this.fired_from_position.y);
                return current_position;
              },
              draw: function (frame_count) {
                this.sprite.draw_z3hs27$(this.current_position(frame_count));
              },
              move: function (frame_count) {
                var pos = this.current_position(frame_count);
                if (pos.x > 800.0) {
                  return false;
                }
                var boss_pos = this.game_world.boss_mob.position;
                var boss_size = this.game_world.boss_mob.sprite.size_on_screen;
                var hit_box_TL = new _.org.darkpaw.ld33.Vector(boss_pos.x - boss_size * 0.4, boss_pos.y - boss_size * 0.8);
                var hit_box_sz = new _.org.darkpaw.ld33.Vector(boss_size * 0.6, boss_size * 0.75);
                if (pos.isInRect(hit_box_TL, hit_box_sz)) {
                  this.game_world.register_hit_boss();
                  return false;
                }
                return true;
              }
            }),
            BossBullet: Kotlin.createClass(null, function (gw, sprite) {
              this.sprite = sprite;
              this.game_world = gw;
              this.speed = 8.0;
              this.fired_from_position = new _.org.darkpaw.ld33.Vector();
              this.fired_at = Kotlin.Long.ZERO;
              this.visible = false;
            }, /** @lends _.org.darkpaw.ld33.mobs.BossBullet.prototype */ {
              current_position: function (frame_count) {
                var time_travelled = frame_count.subtract(this.fired_at);
                var travelled = Math.pow(time_travelled.toNumber(), 1.2) * this.speed;
                var current_position = new _.org.darkpaw.ld33.Vector(this.fired_from_position.x - travelled, this.fired_from_position.y);
                return current_position;
              },
              fire: function (pos, frame) {
                this.visible = true;
                this.fired_from_position = pos;
                this.fired_at = frame;
              },
              draw: function (frame_count) {
                if (this.visible)
                  this.sprite.draw_z3hs27$(this.current_position(frame_count));
              },
              move: function (frame_count) {
                if (!this.visible)
                  return true;
                var pos = this.current_position(frame_count);
                if (pos.x < -60.0) {
                  return false;
                }
                var player_pos = this.game_world.player.position;
                var player_size = this.game_world.player.sprite.size_on_screen;
                var hit_box_TL = new _.org.darkpaw.ld33.Vector(player_pos.x - player_size * 0.25, player_pos.y - player_size + this.sprite.size_on_screen * 0.25);
                var hit_box_sz = new _.org.darkpaw.ld33.Vector(player_size * 0.5, player_size);
                if (pos.isInRect(hit_box_TL, hit_box_sz)) {
                  this.game_world.register_hit_player();
                  return false;
                }
                return true;
              }
            }),
            PlayerMob: Kotlin.createClass(null, function (gw, sprite) {
              var tmp$0;
              this.sprite = sprite;
              this.game_world = gw;
              this.position = new _.org.darkpaw.ld33.Vector();
              this.move_timer = new _.org.darkpaw.ld33.mobs.ActionTimer();
              this.waypoints = new Kotlin.DefaultPrimitiveHashMap();
              this.waypoint_names = Kotlin.modules['stdlib'].kotlin.arrayListOf_9mqe4v$([]);
              this.move_delta = new _.org.darkpaw.ld33.Vector();
              this.mv_speed = 4.5;
              this.between_waypoints = false;
              this.stop_time = 12.0;
              this.stop_for_firing_time = 42.0;
              this.lives = 0;
              this.init_waypoints();
              this.current_waypoint = (tmp$0 = this.waypoints.get_za3rmp$('top_far')) != null ? tmp$0 : Kotlin.throwNPE();
              this.reset();
            }, /** @lends _.org.darkpaw.ld33.mobs.PlayerMob.prototype */ {
              reset: function () {
                var tmp$0;
                this.current_waypoint = (tmp$0 = this.waypoints.get_za3rmp$('top_far')) != null ? tmp$0 : Kotlin.throwNPE();
                this.position = this.current_waypoint.position;
                this.move_timer.set(this.stop_time);
              },
              draw: function () {
                this.sprite.draw_z3hs27$(this.position);
              },
              move: function (frame_count) {
                if (this.between_waypoints) {
                  this.position = this.position.plus(this.move_delta);
                  var wp = this.current_waypoint.position;
                  if (this.position.isInRect(new _.org.darkpaw.ld33.Vector(wp.x - 5.0, wp.y - 5.0), new _.org.darkpaw.ld33.Vector(10.0, 10.0))) {
                    this.position = wp;
                    this.move_delta = new _.org.darkpaw.ld33.Vector();
                    this.between_waypoints = false;
                    this.move_timer.set(this.stop_time);
                  }
                }
                 else {
                  this.move_timer.tick();
                  if (this.move_timer.expired) {
                    if (Math.random() < 0.5) {
                      this.decide_randomly();
                    }
                     else {
                      this.decide_move();
                    }
                    this.move_timer.set(this.stop_time);
                  }
                }
              },
              goto: function (waypoint_name) {
                var tmp$0;
                Kotlin.println('Goto ' + waypoint_name);
                this.between_waypoints = true;
                var waypoint = (tmp$0 = this.waypoints.get_za3rmp$(waypoint_name)) != null ? tmp$0 : Kotlin.throwNPE();
                var delta_x = 0.0;
                var delta_y = 0.0;
                if (waypoint.position.x > this.current_waypoint.position.x)
                  delta_x = this.mv_speed;
                if (waypoint.position.x < this.current_waypoint.position.x)
                  delta_x = -this.mv_speed;
                if (waypoint.position.y > this.current_waypoint.position.y)
                  delta_y = this.mv_speed;
                if (waypoint.position.y < this.current_waypoint.position.y)
                  delta_y = -this.mv_speed;
                this.move_delta = new _.org.darkpaw.ld33.Vector(delta_x, delta_y);
                this.current_waypoint = waypoint;
              },
              decide_randomly: function () {
                if (Math.random() < 0.66) {
                  this.fire();
                }
                 else {
                  var idx = Math.random() * this.current_waypoint.accessible.size() | 0;
                  var new_waypoint_name = this.current_waypoint.accessible.get_za3lpa$(idx);
                  this.goto(new_waypoint_name);
                }
              },
              decide_move: function () {
                var tmp$0;
                var ct = this.game_world.boss_mob.cycle_angle;
                Kotlin.println('Decide move at ct ' + ct + ', current WP |' + this.current_waypoint.name + '|');
                var action = 'none';
                tmp$0 = this.current_waypoint.name;
                if (tmp$0 === 'top_far')
                  if (ct < 100)
                    action = 'top_close';
                  else
                    action = 'fire';
                else if (tmp$0 === 'top_close')
                  if (ct < 130)
                    action = 'middle_far';
                  else
                    action = 'fire';
                else if (tmp$0 === 'middle_far')
                  if (ct < 50)
                    action = 'bottom_far';
                  else if (ct < 130)
                    action = 'middle_mid';
                  else if (ct < 160)
                    action = 'fire';
                  else
                    action = 'top_close';
                else if (tmp$0 === 'middle_mid')
                  if (ct < 90)
                    action = 'middle_far';
                  else if (ct >= 90 && ct < 120)
                    action = 'middle_close';
                  else if (ct >= 120)
                    action = 'fire';
                  else
                    action = 'fire';
                else if (tmp$0 === 'middle_close')
                  if (ct > 70)
                    action = 'middle_mid';
                  else
                    action = 'fire';
                else if (tmp$0 === 'bottom_far')
                  if (ct < 50)
                    action = 'middle_far';
                  else if (ct < 150)
                    action = 'bottom_mid';
                  else
                    action = 'fire';
                else if (tmp$0 === 'bottom_mid')
                  if (ct > 90)
                    action = 'bottom_far';
                  else if (ct > 150)
                    action = 'bottom_close';
                  else
                    action = 'fire';
                else if (tmp$0 === 'bottom_close')
                  if (ct > 60)
                    action = 'bottom_mid';
                  else
                    action = 'fire';
                if (Kotlin.equals(action, 'none'))
                  return;
                else if (Kotlin.equals(action, 'fire'))
                  this.fire();
                else
                  this.goto(action);
              },
              fire: function () {
                this.move_timer.set(this.stop_for_firing_time);
                Kotlin.println('Player fires!!');
                var gun_position = new _.org.darkpaw.ld33.Vector(this.position.x + this.sprite.size * 0.33, this.position.y - this.sprite.size * 0.6);
                this.game_world.player_fire(gun_position);
              },
              add_waypoint: function (name, position) {
                this.waypoint_names.add_za3rmp$(name);
                var wp = new _.org.darkpaw.ld33.map.Waypoint(position, name);
                this.waypoints.put_wn2jw4$(name, wp);
                return wp;
              },
              init_waypoints: function () {
                var wp = this.add_waypoint('top_far', new _.org.darkpaw.ld33.Vector(10.0, 60.0));
                wp.accessible.add_za3rmp$('top_close');
                wp = this.add_waypoint('top_close', new _.org.darkpaw.ld33.Vector(120.0, 60.0));
                wp.accessible.add_za3rmp$('top_far');
                wp.accessible.add_za3rmp$('middle_far');
                wp = this.add_waypoint('middle_far', new _.org.darkpaw.ld33.Vector(120.0, 180.0));
                wp.accessible.add_za3rmp$('middle_mid');
                wp.accessible.add_za3rmp$('top_close');
                wp.accessible.add_za3rmp$('bottom_far');
                wp = this.add_waypoint('middle_mid', new _.org.darkpaw.ld33.Vector(230.0, 180.0));
                wp.accessible.add_za3rmp$('middle_far');
                wp.accessible.add_za3rmp$('middle_close');
                wp = this.add_waypoint('middle_close', new _.org.darkpaw.ld33.Vector(340.0, 180.0));
                wp.accessible.add_za3rmp$('middle_mid');
                wp = this.add_waypoint('bottom_far', new _.org.darkpaw.ld33.Vector(120.0, 304.0));
                wp.accessible.add_za3rmp$('middle_far');
                wp.accessible.add_za3rmp$('bottom_mid');
                wp = this.add_waypoint('bottom_mid', new _.org.darkpaw.ld33.Vector(232.0, 304.0));
                wp.accessible.add_za3rmp$('bottom_far');
                wp.accessible.add_za3rmp$('bottom_close');
                wp = this.add_waypoint('bottom_close', new _.org.darkpaw.ld33.Vector(345.0, 304.0));
                wp.accessible.add_za3rmp$('bottom_mid');
              }
            }),
            FlameTargetMob: Kotlin.createClass(null, function (gw, target_image) {
              this.target_image = target_image;
              this.game_world = gw;
              this.position = new _.org.darkpaw.ld33.Vector();
              this.target_timer = new _.org.darkpaw.ld33.mobs.ActionTimer();
              this.visible = false;
            }, /** @lends _.org.darkpaw.ld33.mobs.FlameTargetMob.prototype */ {
              activate: function (v) {
                this.position = v;
                this.visible = true;
                this.target_timer.set(45.0);
              },
              move: function () {
                this.target_timer.tick();
                if (this.target_timer.expired) {
                  this.visible = false;
                }
              },
              draw: function () {
                if (this.visible) {
                  this.game_world.context.drawImage(this.target_image, this.position.x - 64.0, this.position.y - 64.0);
                }
              }
            }),
            BossMob: Kotlin.createClass(null, function (gw, sprite) {
              this.sprite = sprite;
              this.game_world = gw;
              this.position = new _.org.darkpaw.ld33.Vector();
              this.boss_delta = new _.org.darkpaw.ld33.Vector();
              this.reload_timer = new _.org.darkpaw.ld33.mobs.ActionTimer();
              this.reloading = false;
              this.cycle_time = 2400;
              this.HP = 0;
              this.cycle_angle = 0.0;
              this.reset();
            }, /** @lends _.org.darkpaw.ld33.mobs.BossMob.prototype */ {
              reset: function () {
                this.HP = 500;
                this.position = new _.org.darkpaw.ld33.Vector(this.game_world.width * 0.6, this.game_world.height - 175.0);
                this.reloading = false;
              },
              draw: function () {
                var draw_position = new _.org.darkpaw.ld33.Vector(this.position.x - this.sprite.size_on_screen / 2, this.position.y - this.sprite.size_on_screen);
                this.sprite.draw_z3hs27$(draw_position);
              },
              move: function (frame_count) {
                var frames = frame_count.modulo(Kotlin.Long.fromInt(this.cycle_time));
                var frames_degrees = frames.toNumber() / this.cycle_time * 180.0;
                this.cycle_angle = frames_degrees;
                this.reload_timer.tick();
                this.reloading = !this.reload_timer.expired;
                var y = (Math.sin(frames_degrees) + 1) / 2.0;
                var new_pos_x = this.game_world.width * 0.75 + y * 80.0;
                var new_pos_y = this.game_world.height + 20.0 - y * 0.5 * this.game_world.height;
                this.position = new _.org.darkpaw.ld33.Vector(new_pos_x, new_pos_y);
              },
              fire: function () {
                this.reload_timer.set(this.game_world.target_fps * 2.4);
                this.reloading = true;
              }
            })
          }),
          effects: Kotlin.definePackage(null, /** @lends _.org.darkpaw.ld33.effects */ {
            RandomPixels: Kotlin.createClass(null, function (context) {
              this.context = context;
              this.height = _.org.darkpaw.ld33.canvas.height;
              this.width = _.org.darkpaw.ld33.canvas.width;
              this.hue = 0;
            }, /** @lends _.org.darkpaw.ld33.effects.RandomPixels.prototype */ {
              pixellate: function () {
                var tmp$0;
                this.context.save();
                tmp$0 = 12;
                for (var i = 1; i <= tmp$0; i++) {
                  this.context.beginPath();
                  var x = this.width * Math.random();
                  var y = this.height * Math.random();
                  var px_size = 12 * Math.random();
                  this.context.lineWidth = px_size;
                  this.context.moveTo(x, y);
                  this.context.lineTo(x + px_size, y);
                  this.hue += Math.random() * 10 | 0;
                  this.context.strokeStyle = 'hsla(' + this.hue + ', 90%, 20%, 0.3)';
                  this.context.shadowColor = 'white';
                  this.context.shadowBlur = 3.0;
                  this.context.stroke();
                }
                this.context.restore();
              }
            }),
            FancyLines: Kotlin.createClass(null, function (context) {
              this.context = context;
              this.height = _.org.darkpaw.ld33.canvas.height;
              this.width = _.org.darkpaw.ld33.canvas.width;
              this.x = this.width * Math.random();
              this.y = this.height * Math.random();
              this.hue = 0;
            }, /** @lends _.org.darkpaw.ld33.effects.FancyLines.prototype */ {
              line: function () {
                this.context.save();
                this.context.beginPath();
                this.context.lineWidth = 50.0 * Math.random();
                this.context.moveTo(this.x, this.y);
                this.x = this.width * Math.random();
                this.y = this.height * Math.random();
                this.context.bezierCurveTo(this.width * Math.random(), this.height * Math.random(), this.width * Math.random(), this.height * Math.random(), this.x, this.y);
                this.hue += Math.random() * 10 | 0;
                this.context.strokeStyle = 'hsl(' + this.hue + ', 50%, 50%)';
                this.context.shadowColor = 'white';
                this.context.shadowBlur = 10.0;
                this.context.stroke();
                this.context.restore();
              },
              blank: function () {
                this.context.fillStyle = 'rgba(0,0,0,0.05)';
                this.context.fillRect(0.0, 0.0, this.width, this.height);
              },
              run: function () {
                window.setInterval(_.org.darkpaw.ld33.effects.FancyLines.run$f(this), 40);
                window.setInterval(_.org.darkpaw.ld33.effects.FancyLines.run$f_0(this), 100);
              }
            }, /** @lends _.org.darkpaw.ld33.effects.FancyLines */ {
              run$f: function (this$FancyLines) {
                return function () {
                  this$FancyLines.line();
                };
              },
              run$f_0: function (this$FancyLines) {
                return function () {
                  this$FancyLines.blank();
                };
              }
            }),
            Grid: Kotlin.createClass(null, function (context) {
              this.context = context;
              this.height = _.org.darkpaw.ld33.canvas.height;
              this.width = _.org.darkpaw.ld33.canvas.width;
              this.hue = 0;
            }, /** @lends _.org.darkpaw.ld33.effects.Grid.prototype */ {
              gridify: function () {
                var tmp$0, tmp$1;
                this.context.save();
                tmp$0 = (new Kotlin.NumberRange(1.0, 12.0)).iterator();
                while (tmp$0.hasNext()) {
                  var y = tmp$0.next();
                  this.context.beginPath();
                  this.context.lineWidth = 0.5;
                  this.context.moveTo(0.0, y * 40);
                  this.context.lineTo(this.width, y * 40);
                  this.hue += Math.random() * 10 | 0;
                  this.context.strokeStyle = 'hsl(' + this.hue + ', 50%, 50%)';
                  this.context.stroke();
                }
                tmp$1 = (new Kotlin.NumberRange(1.0, 16.0)).iterator();
                while (tmp$1.hasNext()) {
                  var x = tmp$1.next();
                  this.context.beginPath();
                  this.context.lineWidth = 0.5;
                  this.context.moveTo(x * 60, 0.0);
                  this.context.lineTo(x * 60, this.height);
                  this.hue += Math.random() * 10 | 0;
                  this.context.strokeStyle = 'hsl(' + this.hue + ', 50%, 50%)';
                  this.context.stroke();
                }
                this.context.restore();
              }
            })
          }),
          sprites: Kotlin.definePackage(null, /** @lends _.org.darkpaw.ld33.sprites */ {
            BulletSprite: Kotlin.createClass(function () {
              return [_.org.darkpaw.ld33.PixelSprite];
            }, function $fun(context) {
              $fun.baseInitializer.call(this, context, 32, 3.2);
              this.clear_to_alpha_za3lpa$(10);
              this.setpx_pfysp4$(1580, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1584, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1588, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1592, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1596, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1600, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1604, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1608, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1612, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1616, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1700, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1704, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1708, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1712, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1716, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1720, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1724, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1728, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1732, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1736, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1740, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1744, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1748, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1752, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1820, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1824, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1828, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1832, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1836, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1840, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1844, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1848, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1852, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1856, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1860, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1864, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1868, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1872, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1876, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1880, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1884, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1888, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1948, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1952, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1956, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1960, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1964, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1968, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1972, new _.org.darkpaw.ld33.RGBA(32, 103, 255, 255));
              this.setpx_pfysp4$(1976, new _.org.darkpaw.ld33.RGBA(32, 103, 255, 255));
              this.setpx_pfysp4$(1980, new _.org.darkpaw.ld33.RGBA(32, 103, 255, 255));
              this.setpx_pfysp4$(1984, new _.org.darkpaw.ld33.RGBA(32, 103, 255, 255));
              this.setpx_pfysp4$(1988, new _.org.darkpaw.ld33.RGBA(32, 103, 255, 255));
              this.setpx_pfysp4$(1992, new _.org.darkpaw.ld33.RGBA(32, 103, 255, 255));
              this.setpx_pfysp4$(1996, new _.org.darkpaw.ld33.RGBA(32, 103, 255, 255));
              this.setpx_pfysp4$(2000, new _.org.darkpaw.ld33.RGBA(32, 103, 255, 255));
              this.setpx_pfysp4$(2004, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2008, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2012, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2016, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2076, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2080, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2084, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2088, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2092, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2096, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2100, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2104, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2108, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2112, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2116, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2120, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2124, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2128, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2132, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2136, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2140, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2144, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2212, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2216, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2220, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2224, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2228, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2232, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2236, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2240, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2244, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2248, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2252, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2256, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2260, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2264, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2348, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2352, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2356, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2360, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2364, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2368, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2372, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2376, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2380, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2384, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
            }),
            PlayerBulletSprite: Kotlin.createClass(function () {
              return [_.org.darkpaw.ld33.PixelSprite];
            }, function $fun(context) {
              $fun.baseInitializer.call(this, context, 32, 3.2);
              this.clear_to_alpha_za3lpa$(10);
              this.setpx_pfysp4$(1228, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1360, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1364, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1368, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1372, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1480, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1488, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1496, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1500, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1504, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1568, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1572, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1576, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1580, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1584, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1588, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1592, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1596, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1600, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1604, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1608, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1612, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1616, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1620, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1624, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1628, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1632, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1700, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1704, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1708, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1712, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1716, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1720, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1724, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1728, new _.org.darkpaw.ld33.RGBA(179, 227, 85, 255));
              this.setpx_pfysp4$(1732, new _.org.darkpaw.ld33.RGBA(179, 227, 85, 255));
              this.setpx_pfysp4$(1736, new _.org.darkpaw.ld33.RGBA(179, 227, 85, 255));
              this.setpx_pfysp4$(1740, new _.org.darkpaw.ld33.RGBA(227, 85, 85, 255));
              this.setpx_pfysp4$(1744, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1748, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1752, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1756, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1760, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1768, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1816, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1820, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1824, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1828, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1832, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1836, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1840, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1844, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1848, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1852, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1856, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1860, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1864, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
              this.setpx_pfysp4$(1868, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1872, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1876, new _.org.darkpaw.ld33.RGBA(227, 85, 85, 255));
              this.setpx_pfysp4$(1880, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1884, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1888, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1896, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1940, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1944, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1948, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1952, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1956, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1960, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(1964, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1968, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1972, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1976, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1980, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1984, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1988, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(1992, new _.org.darkpaw.ld33.RGBA(227, 187, 85, 255));
              this.setpx_pfysp4$(1996, new _.org.darkpaw.ld33.RGBA(227, 85, 85, 255));
              this.setpx_pfysp4$(2000, new _.org.darkpaw.ld33.RGBA(227, 85, 85, 255));
              this.setpx_pfysp4$(2004, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
              this.setpx_pfysp4$(2008, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(2012, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2016, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2096, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(2100, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(2104, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(2108, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(2112, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(2116, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(2120, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(2124, new _.org.darkpaw.ld33.RGBA(217, 190, 30, 255));
              this.setpx_pfysp4$(2128, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
              this.setpx_pfysp4$(2132, new _.org.darkpaw.ld33.RGBA(217, 190, 30, 255));
              this.setpx_pfysp4$(2136, new _.org.darkpaw.ld33.RGBA(255, 240, 2, 255));
              this.setpx_pfysp4$(2140, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2144, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2148, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2244, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2256, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2260, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2268, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2380, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2388, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2392, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2396, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(2512, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(2532, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
            }),
            PlayerSprite: Kotlin.createClass(function () {
              return [_.org.darkpaw.ld33.PixelSprite];
            }, function $fun(context) {
              $fun.baseInitializer.call(this, context, 32, 3.0);
              this.clear_to_alpha_za3lpa$(30);
              this.setpx_pfysp4$(300, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(304, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(308, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(424, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(428, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(432, new _.org.darkpaw.ld33.RGBA(14, 120, 120, 255));
              this.setpx_pfysp4$(436, new _.org.darkpaw.ld33.RGBA(14, 120, 120, 255));
              this.setpx_pfysp4$(440, new _.org.darkpaw.ld33.RGBA(14, 120, 120, 255));
              this.setpx_pfysp4$(548, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(552, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(556, new _.org.darkpaw.ld33.RGBA(14, 120, 120, 255));
              this.setpx_pfysp4$(560, new _.org.darkpaw.ld33.RGBA(14, 120, 120, 255));
              this.setpx_pfysp4$(564, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(568, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(676, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(680, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(684, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(688, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(692, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(808, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(812, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(816, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(820, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(936, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(940, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(944, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(948, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(952, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1068, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1072, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1076, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1188, new _.org.darkpaw.ld33.RGBA(4, 255, 0, 255));
              this.setpx_pfysp4$(1192, new _.org.darkpaw.ld33.RGBA(4, 255, 0, 255));
              this.setpx_pfysp4$(1196, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(1200, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1316, new _.org.darkpaw.ld33.RGBA(4, 255, 0, 255));
              this.setpx_pfysp4$(1320, new _.org.darkpaw.ld33.RGBA(4, 255, 0, 255));
              this.setpx_pfysp4$(1324, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1328, new _.org.darkpaw.ld33.RGBA(4, 255, 0, 255));
              this.setpx_pfysp4$(1440, new _.org.darkpaw.ld33.RGBA(4, 255, 0, 255));
              this.setpx_pfysp4$(1444, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1448, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1452, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1456, new _.org.darkpaw.ld33.RGBA(4, 255, 0, 255));
              this.setpx_pfysp4$(1460, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(1484, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1564, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1568, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1572, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1576, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1580, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(1584, new _.org.darkpaw.ld33.RGBA(4, 255, 0, 255));
              this.setpx_pfysp4$(1588, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(1596, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1600, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1604, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1608, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1612, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1616, new _.org.darkpaw.ld33.RGBA(227, 179, 85, 255));
              this.setpx_pfysp4$(1692, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1696, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1700, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1704, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1708, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(1712, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(1716, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(1720, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1724, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1728, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1732, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1736, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1740, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1744, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1820, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1824, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1828, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1832, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1836, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1840, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1844, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1848, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1852, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1856, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1860, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1864, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1868, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1948, new _.org.darkpaw.ld33.RGBA(63, 137, 62, 255));
              this.setpx_pfysp4$(1952, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1956, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(1960, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1964, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(1968, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1972, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1976, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1980, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1984, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(1988, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2076, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2080, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2084, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(2088, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(2092, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(2096, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2100, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(2104, new _.org.darkpaw.ld33.RGBA(22, 45, 66, 255));
              this.setpx_pfysp4$(2108, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2200, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(2204, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(2208, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(2212, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(2216, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(2220, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(2224, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(2228, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(2328, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2332, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(2336, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(2340, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(2344, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(2348, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(2456, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2460, new _.org.darkpaw.ld33.RGBA(29, 82, 29, 255));
              this.setpx_pfysp4$(2464, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2468, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(2472, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(2476, new _.org.darkpaw.ld33.RGBA(43, 159, 2, 255));
              this.setpx_pfysp4$(2584, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2588, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2592, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2596, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2600, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2604, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2608, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2716, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2720, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(2724, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2728, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2732, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2736, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2848, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(2852, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2856, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2860, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2864, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2976, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2980, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2984, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(2988, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(2992, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(2996, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3104, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3108, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3116, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3120, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(3124, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3232, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3236, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3248, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3252, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3356, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3360, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3364, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3376, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3380, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3484, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3488, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3492, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3504, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3508, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(3512, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3612, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3616, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3632, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3636, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(3640, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3736, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3740, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3744, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3764, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3768, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3864, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3868, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3872, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3892, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3896, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3988, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3992, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(3996, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(4020, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(4024, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(4028, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
            }),
            RooSprite: Kotlin.createClass(function () {
              return [_.org.darkpaw.ld33.PixelSprite];
            }, function $fun(context) {
              $fun.baseInitializer.call(this, context, 32, 7.0);
              this.tail_on_off = false;
              this.clear_to_alpha_za3lpa$(0);
              this.setpx_pfysp4$(164, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(168, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(288, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(292, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(296, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(300, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(312, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(316, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(420, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(424, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(428, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(432, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(436, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(440, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(552, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(556, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(560, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(564, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(568, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(676, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(680, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(684, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(688, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(692, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(792, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(796, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(800, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(804, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(808, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(812, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(816, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(916, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(920, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(924, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(928, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(932, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(936, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(940, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(944, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1040, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(1044, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(1048, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(1052, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(1056, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(1060, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1064, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1068, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1072, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1168, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(1172, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(1176, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1180, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1184, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1188, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1192, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1196, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1200, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1312, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1316, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1320, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1324, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1328, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1332, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1420, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(1424, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(1428, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(1432, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(1436, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1440, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1444, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(1448, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1452, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1456, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1460, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1464, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1540, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(1544, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(1548, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(1552, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(1556, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(1560, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(1564, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(1568, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(1572, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1576, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1580, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1584, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1588, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1592, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1596, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1648, new _.org.darkpaw.ld33.RGBA(255, 247, 0, 255));
              this.setpx_pfysp4$(1680, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(1684, new _.org.darkpaw.ld33.RGBA(85, 84, 84, 255));
              this.setpx_pfysp4$(1688, new _.org.darkpaw.ld33.RGBA(221, 210, 210, 255));
              this.setpx_pfysp4$(1692, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1696, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1700, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1704, new _.org.darkpaw.ld33.RGBA(135, 135, 135, 255));
              this.setpx_pfysp4$(1708, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1712, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1716, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1720, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(1724, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1728, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1732, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1776, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
              this.setpx_pfysp4$(1780, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
              this.setpx_pfysp4$(1820, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(1824, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(1828, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(1832, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(1836, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(1840, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(1844, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1848, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1852, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1856, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(1860, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1864, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1900, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(1904, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
              this.setpx_pfysp4$(1908, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
              this.setpx_pfysp4$(1948, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1952, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1956, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1960, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(1964, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(1968, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1972, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1976, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1980, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(1984, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1988, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1992, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(1996, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2028, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
              this.setpx_pfysp4$(2032, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
              this.setpx_pfysp4$(2036, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
              this.setpx_pfysp4$(2084, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2088, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2092, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2096, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2100, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2104, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2108, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2112, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2116, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2120, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2124, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2156, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
              this.setpx_pfysp4$(2160, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2212, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2216, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2220, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2224, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2228, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2232, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2236, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2240, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2244, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2248, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2252, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2256, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2284, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2288, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2348, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2352, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2356, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2360, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2364, new _.org.darkpaw.ld33.RGBA(84, 46, 19, 255));
              this.setpx_pfysp4$(2368, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2372, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2376, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2380, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2384, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2408, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2412, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2476, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2480, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2484, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2488, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2492, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2496, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2500, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2504, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2508, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2512, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2532, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2536, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2540, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2600, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(2604, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(2608, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2612, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2616, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2620, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2624, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2628, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2632, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2636, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2640, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2644, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2656, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2660, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2664, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2668, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2724, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2728, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2732, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(2736, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2740, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2744, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2748, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2752, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2756, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2760, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2764, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2768, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2772, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2784, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2788, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2792, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2848, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2852, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2856, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2860, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2864, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(2868, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(2872, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2876, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2880, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2884, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2888, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(2892, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2896, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2904, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2908, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2912, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2916, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2976, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(2980, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2984, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2988, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(2992, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(2996, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3000, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3004, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3008, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3012, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3016, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3020, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3024, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3028, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3032, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(3036, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3040, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3108, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3112, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3116, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(3120, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3124, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3128, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3132, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3136, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3140, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3144, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3148, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3152, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3156, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3160, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3164, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3168, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3240, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3244, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(3248, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3252, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3256, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3260, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3268, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3272, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3276, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3280, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3284, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3288, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3292, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3372, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3376, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(3380, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3384, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3388, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(3392, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(3396, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3400, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3404, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3408, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3412, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3492, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3496, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3500, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3504, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3508, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(3512, new _.org.darkpaw.ld33.RGBA(66, 45, 22, 255));
              this.setpx_pfysp4$(3516, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(3520, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3528, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3612, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3616, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3620, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(3624, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3628, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(3632, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(3636, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(3640, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3644, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3648, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3732, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3736, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3740, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3744, new _.org.darkpaw.ld33.RGBA(132, 85, 45, 255));
              this.setpx_pfysp4$(3756, new _.org.darkpaw.ld33.RGBA(103, 73, 39, 255));
              this.setpx_pfysp4$(3760, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3764, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3768, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3884, new _.org.darkpaw.ld33.RGBA(0, 0, 0, 255));
              this.setpx_pfysp4$(3888, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
              this.setpx_pfysp4$(3892, new _.org.darkpaw.ld33.RGBA(206, 163, 115, 255));
            }, /** @lends _.org.darkpaw.ld33.sprites.RooSprite.prototype */ {
              show_reloading: function (yup) {
                if (yup) {
                  this.setpx_pfysp4$(1564, new _.org.darkpaw.ld33.RGBA(255, 20, 30, 255));
                  this.setpx_pfysp4$(1568, new _.org.darkpaw.ld33.RGBA(255, 30, 20, 255));
                }
                 else {
                  this.setpx_pfysp4$(1564, new _.org.darkpaw.ld33.RGBA(0, 220, 30, 255));
                  this.setpx_pfysp4$(1568, new _.org.darkpaw.ld33.RGBA(0, 230, 20, 255));
                }
              },
              coinflip: function () {
                return Math.random() < 0.5;
              },
              flicker_tail: function () {
                this.tail_on_off = !this.tail_on_off;
                if (this.tail_on_off) {
                  if (this.coinflip())
                    this.setpx_pfysp4$(1776, new _.org.darkpaw.ld33.RGBA(187, 31, 55, 255));
                  if (this.coinflip())
                    this.setpx_pfysp4$(1780, new _.org.darkpaw.ld33.RGBA(252, 111, 185, 255));
                  if (this.coinflip())
                    this.setpx_pfysp4$(1900, new _.org.darkpaw.ld33.RGBA(235, 140, 2, 255));
                  if (this.coinflip())
                    this.setpx_pfysp4$(1904, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
                  if (this.coinflip())
                    this.setpx_pfysp4$(1908, new _.org.darkpaw.ld33.RGBA(215, 240, 2, 255));
                  if (this.coinflip())
                    this.setpx_pfysp4$(2028, new _.org.darkpaw.ld33.RGBA(255, 220, 2, 255));
                  if (this.coinflip())
                    this.setpx_pfysp4$(2032, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
                  if (this.coinflip())
                    this.setpx_pfysp4$(2036, new _.org.darkpaw.ld33.RGBA(255, 128, 0, 255));
                }
                 else {
                  this.setpx_pfysp4$(1900, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
                  this.setpx_pfysp4$(1904, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
                  this.setpx_pfysp4$(1908, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
                  this.setpx_pfysp4$(2028, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
                  this.setpx_pfysp4$(2032, new _.org.darkpaw.ld33.RGBA(219, 81, 0, 255));
                  this.setpx_pfysp4$(2036, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
                  this.setpx_pfysp4$(1776, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
                  this.setpx_pfysp4$(1780, new _.org.darkpaw.ld33.RGBA(227, 91, 85, 255));
                }
              }
            })
          }),
          map: Kotlin.definePackage(null, /** @lends _.org.darkpaw.ld33.map */ {
            Waypoint: Kotlin.createClass(null, function (position, name) {
              this.position = position;
              this.name = name;
              this.accessible = Kotlin.modules['stdlib'].kotlin.arrayListOf_9mqe4v$([]);
            })
          })
        })
      })
    })
  });
  Kotlin.defineModule('ld33', _);
  _.org.darkpaw.ld33.main([]);
}(Kotlin));
