/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 50720
 Source Host           : localhost:3306
 Source Schema         : panker_game

 Target Server Type    : MySQL
 Target Server Version : 50720
 File Encoding         : 65001

 Date: 15/12/2017 20:27:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for brick
-- ----------------------------
DROP TABLE IF EXISTS `brick`;
CREATE TABLE `brick`  (
  `brickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `brickstyle` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `ht` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '高',
  `wd` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '宽'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for bullet
-- ----------------------------
DROP TABLE IF EXISTS `bullet`;
CREATE TABLE `bullet`  (
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '子弹归属那个用户',
  `bulletX` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `bulletY` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `bulletStyle` varchar(2) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `direction` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `roomnum` int(12) NOT NULL COMMENT '子弹所在房间',
  `bulletname` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '子弹名称'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bullet
-- ----------------------------
INSERT INTO `bullet` VALUES ('5ad121', '461', '216', NULL, 'bottom', 71, '5ad1218');
INSERT INTO `bullet` VALUES ('5ad121', '461', '216', NULL, 'bottom', 71, '5ad1217');

-- ----------------------------
-- Table structure for comm_map
-- ----------------------------
DROP TABLE IF EXISTS `comm_map`;
CREATE TABLE `comm_map`  (
  `mapname` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '地图名字，对应game_map表',
  `brickname` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '砖的类型',
  `posX` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'x坐标',
  `poxY` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'y坐标',
  `left` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '左边东西类型，枪或砖，0，代表没有，1代表墙，2代表砖',
  `top` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '上边东西类型，枪或砖，0，代表没有，1代表墙，2代表砖',
  `bottom` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '下边东西类型，枪或砖，0，代表没有，1代表墙，2代表砖',
  `right` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '右边东西类型，枪或砖，0，代表没有，1代表墙，2代表砖'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for createuser
-- ----------------------------
DROP TABLE IF EXISTS `createuser`;
CREATE TABLE `createuser`  (
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `userstatus` int(12) NULL DEFAULT NULL COMMENT '0：刚进入游戏主页面，1：进入等待界面，2：进入游戏',
  `userroom` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表，创建插入' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of createuser
-- ----------------------------
INSERT INTO `createuser` VALUES ('00719497', 0, NULL);
INSERT INTO `createuser` VALUES ('1efb4429a5', 0, NULL);
INSERT INTO `createuser` VALUES ('5ad121', 0, NULL);
INSERT INTO `createuser` VALUES ('5fa520c1', 0, NULL);
INSERT INTO `createuser` VALUES ('75ca40f9b0', 0, NULL);
INSERT INTO `createuser` VALUES ('778d760c24', 0, NULL);
INSERT INTO `createuser` VALUES ('8ef53c90b9', 0, NULL);
INSERT INTO `createuser` VALUES ('ba93ea0afb', 0, NULL);
INSERT INTO `createuser` VALUES ('c961dc58', 0, NULL);
INSERT INTO `createuser` VALUES ('d8785f549f', 0, NULL);

-- ----------------------------
-- Table structure for game_food
-- ----------------------------
DROP TABLE IF EXISTS `game_food`;
CREATE TABLE `game_food`  (
  `posXY` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '食物位置',
  `foodStyle` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '食物类型，1:基本子弹，2:中级子弹，3:高级子弹，4:血包，5:防护罩，6:瞬移',
  `roomnum` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '所属房间号'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for game_map
-- ----------------------------
DROP TABLE IF EXISTS `game_map`;
CREATE TABLE `game_map`  (
  `mapname` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `mapstyle` varchar(2) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '地图类型',
  PRIMARY KEY (`mapname`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_map
-- ----------------------------
INSERT INTO `game_map` VALUES ('e', '4');
INSERT INTO `game_map` VALUES ('æˆ‘', '4');

-- ----------------------------
-- Table structure for game_room
-- ----------------------------
DROP TABLE IF EXISTS `game_room`;
CREATE TABLE `game_room`  (
  `roomname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '房间名',
  `roomnum` int(12) NOT NULL AUTO_INCREMENT COMMENT '房间号',
  `roompsw` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '房间密码',
  `isbegin` varchar(2) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '游戏是否开启，1代表开启，用户无法再进入，0代表等待用户进入',
  `roommaster` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  PRIMARY KEY (`roomnum`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 74 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = '游戏房间' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_room
-- ----------------------------
INSERT INTO `game_room` VALUES ('1', 45, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('w', 46, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('2', 47, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('3', 48, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('4', 49, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('5', 50, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('6', 51, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('7', 52, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('8', 53, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('9', 54, '1', '0', NULL);
INSERT INTO `game_room` VALUES ('we', 66, 'NaN', '1', 'c961dc58');

-- ----------------------------
-- Table structure for panker
-- ----------------------------
DROP TABLE IF EXISTS `panker`;
CREATE TABLE `panker`  (
  `panker` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `wd` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `ht` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for pankerstatus
-- ----------------------------
DROP TABLE IF EXISTS `pankerstatus`;
CREATE TABLE `pankerstatus`  (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `posX` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `posY` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `direction` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pankerstatus
-- ----------------------------
INSERT INTO `pankerstatus` VALUES (1, '100', '50', 'bottom');
INSERT INTO `pankerstatus` VALUES (2, '500', '50', 'bottom');
INSERT INTO `pankerstatus` VALUES (3, '1000', '50', 'bottom');
INSERT INTO `pankerstatus` VALUES (4, '100', '600', 'top');
INSERT INTO `pankerstatus` VALUES (5, '500', '600', 'top');
INSERT INTO `pankerstatus` VALUES (6, '1000', '600', 'top');

-- ----------------------------
-- Table structure for tem_user
-- ----------------------------
DROP TABLE IF EXISTS `tem_user`;
CREATE TABLE `tem_user`  (
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `posX` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `posY` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `live` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '生=1，死=0',
  `bulletnum` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '用户子弹初始数量',
  `panker` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'tanker 对应panker表',
  `userlife` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '生命值，默认3',
  `direction` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '当前坦克方向',
  `roomnum` int(12) NULL DEFAULT NULL COMMENT '房间号',
  `serialNum` int(2) NULL DEFAULT NULL COMMENT '用户是第几个进入该房间的，最大值为6',
  `killNum` int(2) UNSIGNED NULL DEFAULT 0 COMMENT '杀敌数量',
  `killByWho` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '被谁杀死',
  PRIMARY KEY (`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = '游戏状态表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tmp_map
-- ----------------------------
DROP TABLE IF EXISTS `tmp_map`;
CREATE TABLE `tmp_map`  (
  `mapname` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '地图名字，对应game_map表',
  `brickname` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '砖的类型',
  `posX` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'x坐标',
  `poxY` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'y坐标',
  `left` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '左边东西类型，枪或砖，0，代表没有，1代表墙，2代表砖',
  `top` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '上边东西类型，枪或砖，0，代表没有，1代表墙，2代表砖',
  `bottom` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '下边东西类型，枪或砖，0，代表没有，1代表墙，2代表砖',
  `right` varchar(12) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '右边东西类型，枪或砖，0，代表没有，1代表墙，2代表砖'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
