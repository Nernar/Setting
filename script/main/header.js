/*

   Copyright 2015 Dmitry Medvedev (vk.com/id305567723)
   Copyright 2018-2022 Nernar (github.com/nernar)
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

IMPORT("Retention:5");

const getX = function() {
	let position = Player.getPosition();
	return Math.floor(position.x);
};

const getY = function() {
	let position = Player.getPosition();
	return Math.floor(position.y - 1);
};

const getZ = function() {
	let position = Player.getPosition();
	return Math.floor(position.z);
};

const formatInt = function(number) {
	if (number < 1000) return number;
	else if (number >= 1000000) return Math.floor(number / 1000000) + Math.floor(number % 1000000 / 100000) + "M";
	else if (number >= 100000) return Math.floor(number / 1000) + "K";
	else if (number >= 1000) return Math.floor(number / 1000) + "." + Math.floor(number % 1000 / 100) + "K";
};
