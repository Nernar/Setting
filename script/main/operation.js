let replace = rule = false,
	koll_total = 0, koll_insert = 0, koll_current = 0,
	setsovle = [false, false],
	sovleGoFunctions = true,
	pos1, pos2, blocks = [], covered,
	overrideLegacyPasting = true,
	functionNumber = 0, clientUid,
	isServer = false, doPrivileged = false,
	ab = bc = cd = 0, tick = 0,
	leaved = rover = true, region;

const getCompletionMessage = function(which) {
	return [
		translate("%s blocks filled", koll_current),
		translate("%s blocks copied", koll_current),
		translate("%s blocks inserted", koll_current),
		translate("%s blocks scanned, of which filled: %s", [koll_current, koll_set]),
		translate("%s blocks scanned, of which replaced: %s", [koll_current, koll_set]),
		translate("%s blocks cut out", koll_current),
		translate("%s blocks scanned, of which covered: %s", [koll_current, koll_set])
	][which - 1];
};

const checkForCompletion = function(which) {
	if (koll_current >= koll_total) {
		stop();
		if (which == 2 || which == 6) {
			setsovle = [true, true];
		}
		if (which == 3) {
			setsovle[1] = false;
		}
		handle(function() {
			if (windowDynamic) updateButton();
			showHint(getCompletionMessage(which));
		});
		return which;
	}
	return 0;
};

const functions = function() {
	let step = 0;
	do {
		step++;
		xa = xxa + x1;
		ya = yya + y1;
		za = zza + z1;
		koll_current++;

		if (functionNumber == 1) {
			setBlockIdDataUniversal(xa, ya, za, idLocal, dataLocal);
		}

		if (functionNumber == 2 || functionNumber == 6) {
			let block = {
				x: xxa,
				y: yya,
				z: zza
			};

			let state = getBlockUniversal(xa, ya, za);
			if (state != null) {
				if (state.id != 0) {
					block.id = getNameByID(state.id) || state.id;
					block.data = state.data;
				}
				if (state.getNamedStatesScriptable) {
					let namedStates = state.getNamedStatesScriptable();
					for (let key in namedStates) {
						block.states = namedStates;
						break;
					}
				}
			}

			let container = getBlockEntityUniversal(xa, ya, za);
			if (container != null) {
				let tag = container.getCompoundTag();
				if (tag != null) {
					block.container = tag.toScriptable();
				}
			}

			let tile = getTileEntityUniversal(xa, ya, za);
			if (tile != null) {
				let prototype = {
					data: tile.data,
					coords: {
						x: tile.x,
						y: tile.y,
						z: tile.z,
						d: tile.dimension
					}
				};
				if (tile.networkEntityTypeName != null) {
					prototype.networkEntityTypeName = tile.networkEntityTypeName;
				}
				if (tile.container != null) {
					prototype.container = tile.container;
				}
				if (tile.liquidStorage != null) {
					prototype.liquidStorage = tile.liquidStorage;
				}
				block.tile = prototype;
			}

			let extra = getExtraBlockUniversal(xa, ya, za);
			if (extra != null) {
				if (extra.id != 0) {
					block.extra = {
						id: getNameByID(extra.id) || extra.id,
						data: extra.data
					};
				}
				if (extra.getNamedStatesScriptable) {
					let namedStates = extra.getNamedStatesScriptable();
					for (let key in namedStates) {
						if (block.extra == null) {
							block.extra = {};
						}
						block.extra.states = namedStates;
						break;
					}
				}
			}

			if (block.id != null || block.container != null || block.tile != null || block.extra != null) {
				blocks.push(block);
				if (functionNumber == 6) {
					setBlockIdDataUniversal(xa, ya, za, 0);
					setExtraBlockIdDataUniversal(xa, ya, za, 0);
				}
			}
		}

		if (functionNumber == 3) {
			if (overrideLegacyPasting) {
				if (placeAirBeforePaste && koll_current <= koll_insert) {
					setBlockIdDataUniversal(xa, ya, za, 0);
					setExtraBlockIdDataUniversal(xa, ya, za, 0);
				} else {
					let block = blocks[placeAirBeforePaste ? koll_current - koll_insert - 1 : koll_current - 1];
					if (block.id != null) {
						setBlockUniversal(x1 + block.x, y1 + block.y, z1 + block.z, block);
					}
					if (block.extra != null && block.extra.id != null) {
						setExtraBlockUniversal(x1 + block.x, y1 + block.y, z1 + block.z, block.extra);
					}
				}
			} else {
				let id = blocks[(koll_current - 1) * 2];
				if (id != null && (placeAirBeforePaste || id != 0)) {
					let data = blocks[(koll_current - 1) * 2 + 1];
					setBlockIdDataUniversal(xa, ya, za, id, data);
				}
			}
		}

		if (functionNumber == 4) {
			let block = getBlockUniversal(xa, ya, za);
			if (!(block.id == idLocal && block.data == dataLocal) && (block.id == 0 || (coverOpaqueBlocks && canTileBeReplaced(block.id, block.data)))) {
				setBlockIdDataUniversal(xa, ya, za, idLocal, dataLocal);
				koll_set++;
			}
		}

		if (functionNumber == 5) {
			if (getBlockIdUniversal(xa, ya, za) == id && getBlockDataUniversal(xa, ya, za) == data) {
				setBlockIdDataUniversal(xa, ya, za, idLocal, dataLocal);
				koll_set++;
			}
		}

		if (functionNumber == 7) {
			if (yya == 0 || covered.indexOf(xxa | (yya - 1 << 12) | (zza << 20)) == -1) {
				let cover = getBlockUniversal(xa, ya, za);
				if (!(cover.id == idLocal && cover.data == dataLocal) && (cover.id == 0 || (coverOpaqueBlocks && canTileBeReplaced(cover.id, cover.data)))) {
					let block = getBlockUniversal(xa, ya - 1, za);
					if (block.id != 0 && !(coverOpaqueBlocks && canTileBeReplaced(block.id, block.data))) {
						setBlockIdDataUniversal(xa, ya, za, idLocal, dataLocal);
						koll_set++;
					}
					covered.push(xxa | (yya << 12) | (zza << 20));
				}
			}
		}

		if (checkForCompletion(functionNumber) > 0) {
			break;
		}

		if (operationDirection == 0) {
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
		} else if (operationDirection == 1) {
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
		} else if (operationDirection == 2) {
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
	} while (blocksPerTick == 0 || step < blocksPerTick);
};

Callback.addCallback("tick", function() {
	if (leaved && Game.isDedicatedServer && Game.isDedicatedServer()) {
		leaved = false;
		if (rover) {
			updateSettings();
		}
	}
	if (!isServer && rover && functionNumber > 0 && sovleGoFunctions) {
		functions();
	}
});

const particle = function() {
	if ((!pos1[3] || !pos2[3]) && setsovle[1] == false) {
		updata();
	}

	if (setsovle[1] == true && functionNumber != 3) {
		let position = getPosition();
		x1 = position.x;
		y1 = position.y;
		z1 = position.z;
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

Callback.addCallback(isOutdated ? "ItemUse" : "ItemUseLocal", function(coords, item, block) {
	if (rover && functionNumber == 0) {
		if (item.id == 271) {
			if (pos1[3] == false) {
				pos1 = [coords.x, coords.y, coords.z, true];
			} else if (pos2[3] == false) {
				pos2 = [coords.x, coords.y, coords.z, true];
			}
		} else if (pos1[3] && pos2[3] && item.id == 0) {
			id = block.id;
			data = block.data;
			replace = true;
			handle(function() {
				showHint(translate("Replacement block is selected"));
			});
		} else {
			return;
		}
		handle(function() {
			if (windowDynamic) updateMenu(0);
		});
	}
});

Callback.addCallback("DimensionLoaded", function(currentId, lastId) {
	if (isHorizon) {
		region = BlockSource.getDefaultForActor(getPlayerUid());
		if (region == null) {
			region = BlockSource.getCurrentClientRegion();
		}
	}
});
