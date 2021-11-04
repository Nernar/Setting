let replace = rule = updateGran = false,
	koll_total = koll_current = 0,
	setsovle = [false, false],
	sovleGoFunctions = true,
	pos1, pos2, blocks = new Array(),
	activeM = activeP = 0,
	functionNumber = 0,
	ab = bc = cd = 0,
	leaved = rover = true,
	lastCode = "";

const functions = function() {
	if (sovleGoFunctions) {
		for (let a = 0; a < gran; a++) {
			xa = xxa + x1;
			ya = yya + y1;
			za = zza + z1;
			koll_current++;

			if (functionNumber == 1) {
				World.setBlock(xa, ya, za, idLocal, dataLocal);
				if (koll_current >= koll_total) {
					acquire(function() {
						stop();
						showHint(translate("Заполнено %s блоков", koll_current));
					});
				}
			}

			if (functionNumber == 2) {
				let current = koll_current - 1;
				blocks[current * 2] = World.getBlockID(xa, ya, za);
				blocks[current * 2 + 1] = World.getBlockData(xa, ya, za);

				if (koll_current >= koll_total) {
					acquire(function() {
						stop();
						showHint(translate("Скопировано %s блоков", koll_total));
						setsovle = [true, true];
					});
				}
			}

			if (functionNumber == 3) {
				let current = koll_current - 1,
					pasteId = blocks[current * 2],
					pasteData = blocks[current * 2 + 1];

				if (pasteData) World.setBlock(xa, ya, za, pasteId || 0, pasteData);
				else if (pasteId) World.setBlock(xa, ya, za, pasteId);
				else if (parseAir) World.setBlock(xa, ya, za, 0);

				if (koll_current >= koll_total) {
					acquire(function() {
						stop()
						showHint(translate("Вставлено %s блоков", koll_total));
						setsovle[1] = false;
					});
				}
			}

			if (functionNumber == 4) {
				if (World.getBlockID(xa, ya, za) == 0) {
					World.setBlock(xa, ya, za, idLocal, dataLocal);
					koll_set++;
				}

				if (koll_current >= koll_total) {
					acquire(function() {
						stop();
						showHint(translate("Сканировано %s блоков, из них залито: %s", [koll_total, koll_set]));
					});
				}
			}

			if (functionNumber == 5) {
				if (World.getBlockID(xa, ya, za) == id && World.getBlockData(xa, ya, za) == data) {
					World.setBlock(xa, ya, za, idLocal, dataLocal);
					koll_set++;
				}

				if (koll_current >= koll_total) {
					acquire(function() {
						stop();
						showHint(translate("Сканировано %s блоков, из них заменено: %s", [koll_total, koll_set]));
					});
				}
			}

			if (functionNumber == 6) {
				let current = koll_current - 1;
				blocks[current * 2] = World.getBlockID(xa, ya, za);
				blocks[current * 2 + 1] = World.getBlockData(xa, ya, za);

				World.setBlock(xa, ya, za, 0);
				if (koll_current >= koll_total) {
					acquire(function() {
						stop();
						showHint(translate("Вырезано %s блоков", koll_total));
						setsovle = [true, true];
					});
				}
			}

			if (build == 0) {
				if (zza < zkol) {
					zza++;
				} else {
					zza = 0;
					if (yya < ykol) {
						yya++;
					} else {
						yya = 0;
						if (xxa < xkol) {
							xxa++;
						} else {
							xxa = 0;
						}
					}
				}
			} else if (build == 1) {
				if (xxa < xkol) {
					xxa++;
				} else {
					xxa = 0;
					if (yya < ykol) {
						yya++;
					} else {
						yya = 0;
						if (zza < zkol) {
							zza++;
						} else {
							zza = 0;
						}
					}
				}
			} else if (build == 2) {
				if (xxa < xkol) {
					xxa++;
				} else {
					xxa = 0;
					if (zza < zkol) {
						zza++;
					} else {
						zza = 0;
						if (yya < ykol) {
							yya++;
						} else {
							yya = 0;
						}
					}
				}
			}
		}
	}
};

const particle = function() {
	if ((!pos1[3] || !pos2[3]) && setsovle[1] == false) {
		updata();
	}

	if (setsovle[1] == true && functionNumber != 3) {
		x1 = getX();
		y1 = getY();
		z1 = getZ();
	}

	if (ab < xkol) {
		ab++;
	} else {
		ab = 0;
	}

	if (bc < ykol) {
		bc++;
	} else {
		bc = 0;
	}

	if (cd < zkol) {
		cd++;
	} else {
		cd = 0;
	}

	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5 + ab, y1 + 0.5, z1 + 0.5, 0, 0, 0, 2);
	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5 + ab, y1 + 0.5 + ykol, z1 + 0.5, 0, 0, 0, 2);
	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5 + ab, y1 + 0.5, z1 + 0.5 + zkol, 0, 0, 0, 2);
	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5 + ab, y1 + 0.5 + ykol, z1 + 0.5 + zkol, 0, 0, 0, 2);

	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5, y1 + 0.5 + bc, z1 + 0.5, 0, 0, 0, 2);
	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5 + xkol, y1 + 0.5 + bc, z1 + 0.5, 0, 0, 0, 2);
	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5, y1 + 0.5 + bc, z1 + 0.5 + zkol, 0, 0, 0, 2);
	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5 + xkol, y1 + 0.5 + bc, z1 + 0.5 + zkol, 0, 0, 0, 2);

	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5, y1 + 0.5, z1 + 0.5 + cd, 0, 0, 0, 2);
	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5 + xkol, y1 + 0.5, z1 + 0.5 + cd, 0, 0, 0, 2);
	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5, y1 + 0.5 + ykol, z1 + 0.5 + cd, 0, 0, 0, 2);
	Particles.addParticle(Native.ParticleType.flame, x1 + 0.5 + xkol, y1 + 0.5 + ykol, z1 + 0.5 + cd, 0, 0, 0, 2);
};

const updata = function() {
	x1 = Math.min(pos1[0], pos2[0]);
	y1 = Math.min(pos1[1], pos2[1]);
	z1 = Math.min(pos1[2], pos2[2]);

	x2 = Math.max(pos2[0], pos1[0]);
	y2 = Math.max(pos2[1], pos1[1]);
	z2 = Math.max(pos2[2], pos1[2]);

	xkol = x2 - x1;
	ykol = y2 - y1;
	zkol = z2 - z1;

	koll_total = (xkol + 1) * (ykol + 1) * (zkol + 1);
};

Callback.addCallback("ItemUse", function(coords, item, block) {
	if (functionNumber == 0 && pos1[3] && pos2[3]) {
		handle(function() {
			id = block.id;
			data = block.data;
			replace = true;
			if (menuCanUpdate) updateMenu(type);
			showHint(translate("Блок для замены выбран"));
		});
	}
});