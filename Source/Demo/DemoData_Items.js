"use strict";
class DemoData_Items {
    constructor(parent, randomizer) {
        this.parent = parent;
        this.randomizer = randomizer;
        this.mappableDefns = MappableDefn.Instances();
    }
    buildEntityDefnGroups(universe, visualGetByName, itemCategories) {
        var itemCategoriesByName = ArrayHelper.addLookupsByName(itemCategories);
        // convenience variables
        var categoriesCommon = [
            Collidable.name,
            Drawable.name,
            Item.name,
        ];
        var sizeInPixels = visualGetByName("Floor").sizeInPixels(universe);
        var itemPropertiesNoStack = new ItemDefn("[noStack]", "[Appearance]", "description", 1, // mass
        1, // tradeValue
        1, // stackSizeMax
        new Array(), // categoryNames
        null, // use
        null, // visual
        null // toEntity
        );
        var itemPropertiesStandard = new ItemDefn("[standard]", "[Appearance]", "[description]", 1, // mass
        1, // tradeValue
        999, // stackSizeMax
        new Array(), // categoryNames
        null, // use
        null, // visual
        null // toEntity
        );
        var effectDoNothing = new Effect2(null, null, null);
        var entityDefnSets = [];
        var methodsToRun = [
            this.buildEntityDefns_Amulets,
            this.buildEntityDefns_Armor,
            this.buildEntityDefns_Containers,
            this.buildEntityDefns_Food,
            this.buildEntityDefns_Potions,
            this.buildEntityDefns_Rings,
            this.buildEntityDefns_Scrolls,
            this.buildEntityDefns_Spellbooks,
            this.buildEntityDefns_Stones,
            this.buildEntityDefns_Tools,
            this.buildEntityDefns_Valuables,
            this.buildEntityDefns_Wands,
            this.buildEntityDefns_Weapons,
        ];
        var itemDefnGroups = new Array();
        for (var i = 0; i < methodsToRun.length; i++) {
            var methodToRun = methodsToRun[i];
            var itemDefnGroup = methodToRun.call(this, visualGetByName, itemCategoriesByName, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, [] // entityDefnSets
            );
            itemDefnGroups.push(itemDefnGroup);
            entityDefnSets.push(itemDefnGroup.entityDefns);
        }
        return itemDefnGroups;
    }
    buildEntityDefns_Amulets(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var namesOfAmulets = [
            "Change", "ESP", "Life Saving", "Magical Breathing",
            "Reflection", "Restful Sleep", "Strangulation",
            "Unchanging", "Poision Resistance"
        ];
        var relativeFrequencies = [
            1, 1, 1, 1, 1, 1, 1, 1, 1
        ];
        var appearances = [
            "Circular", "Concave", "Hexagonal", "Octagonal",
            "Oval", "Pyramidal", "Square", "Spherical", "Triangular",
        ];
        var entityDefnSetAmulets = [];
        var randomizer = this.randomizer;
        for (var i = 0; i < namesOfAmulets.length; i++) {
            var name = "Amulet of " + namesOfAmulets[i];
            var relativeFrequency = relativeFrequencies[i];
            var appearanceIndex = Math.floor(randomizer.getNextRandom() * appearances.length);
            var appearance = appearances[appearanceIndex] + " Amulet";
            ArrayHelper.removeAt(appearances, appearanceIndex);
            var visual = visualGetByName(appearance);
            var entityDefn = new Entity2(name, [
                this.mappableDefns.Open,
                Drawable.fromVisual(visual),
                new ItemDefn(name, appearance, appearance, 1, // mass
                1, // tradeValue
                1, // stackSizeMax
                [Amulet.name], // categoryNames
                null, // use
                visual, this.itemDefnToEntity),
                new Generatable(relativeFrequency),
            ]);
            entityDefnSetAmulets.push(entityDefn);
        }
        var visual = visualGetByName(name);
        var name = "Amulet of Yendor";
        var entityDefnAmuletOfYendor = new Entity2(name, [
            this.mappableDefns.Open,
            Drawable.fromVisual(visual),
            new ItemDefn(name, name, name, 1, // mass
            1, // tradeValue
            1, // stackSizeMax
            [Amulet.name], // categoryNames
            null, visual, this.itemDefnToEntity),
        ]);
        entityDefnSetAmulets.push(entityDefnAmuletOfYendor);
        entityDefnSets.push(entityDefnSetAmulets);
        return new EntityDefnGroup("Amulets", 1, entityDefnSets[0]);
    }
    buildEntityDefns_Containers(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var visual = visualGetByName("Chest");
        var entityDefnChest = new Entity2("Chest", [
            itemPropertiesNoStack,
            Drawable.fromVisual(visual)
        ]);
        entityDefnSets.push([entityDefnChest]);
        var returnValue = new EntityDefnGroup("Containers", 1, entityDefnSets[0]);
        return returnValue;
    }
    buildEntityDefns_Food(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var foods = [
            // name, satiety, mass
            new Food("Apple", 50, 2),
            new Food("Banana", 80, 2),
            new Food("C Ration", 300, 10),
            new Food("Candy Bar", 100, 2),
            new Food("Carrot", 50, 2),
            new Food("Cram Ration", 600, 15),
            new Food("Cream Pie", 100, 10),
            new Food("Egg", 80, 1),
            new Food("Eucalyptus Leaf", 30, 1),
            new Food("Food Ration", 800, 20),
            new Food("Fortune Cookie", 40, 1),
            new Food("Garlic Clove", 40, 1),
            new Food("K Ration", 400, 10),
            new Food("Lembas Wafer", 800, 5),
            new Food("Orange", 80, 2),
            new Food("Melon", 100, 5),
            new Food("Pancake", 200, 2),
            new Food("Pear", 50, 2),
            new Food("Royal Jelly", 200, 2),
            new Food("Slime Mold", 80, 5),
            new Food("Tin", 50, 10),
            new Food("Wolfsbane Sprig", 40, 1)
        ];
        var entityDefnSetFoods = new Array();
        var useFood = (uwpe) => {
            var world = uwpe.world;
            var entityUser = uwpe.entity;
            var entityUsed = uwpe.entity2;
            var item = entityUsed.item();
            var itemHolder = entityUser.itemHolder();
            itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var food = entityUsed.food();
            entityUser.starvable2().satietyAdd(world, food.satiety, entityUser);
            var itemDefn = item.defn(world);
            return "You eat the " + itemDefn.appearance;
        };
        var categoryNamesFood = [Food.name];
        var itemDefnToEntity = (uwpe, i) => {
            var returnValue = this.itemDefnToEntity(uwpe, i);
            returnValue.propertyAdd(food);
            return returnValue;
        };
        for (var i = 0; i < foods.length; i++) {
            var food = foods[i];
            var name = food.name;
            var relativeFrequency = 1; // todo
            var visual = visualGetByName(name);
            var entityDefn = new Entity2(name, [
                this.mappableDefns.Open,
                Drawable.fromVisual(visual),
                food,
                new ItemDefn(name, name, // appearance
                name, // description
                food.weight, // mass
                1, // tradeValue
                1, // stackSizeMax,
                categoryNamesFood, useFood, visual, itemDefnToEntity),
                new Generatable(relativeFrequency)
            ]);
            entityDefnSetFoods.push(entityDefn);
        }
        entityDefnSets.push(entityDefnSetFoods);
        return new EntityDefnGroup("Food", 1, entityDefnSets[0]);
    }
    buildEntityDefns_Potions(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var effectMessageNotImplemented = new Effect2((uwpe) => {
            var entityEffectable = uwpe.entity;
            var player = entityEffectable.player();
            if (player != null) {
                player.messageLog.messageAdd("Potion effect not yet implemented!");
            }
        }, null, null);
        var namesAndEffectDefnsOfPotions = [
            [
                "Acid",
                new Effect2((uwpe) => {
                    var e = uwpe.entity;
                    e.killable().integrityAdd(-30);
                    e.player().controlUpdate(uwpe.world, e);
                }, null, null)
            ],
            ["Blindness", effectMessageNotImplemented],
            ["Booze", effectMessageNotImplemented],
            ["Enlightenment", effectMessageNotImplemented],
            ["Confusion", effectMessageNotImplemented],
            [
                "Fruit Juice",
                new Effect2((uwpe) => {
                    var w = uwpe.world;
                    var e = uwpe.entity;
                    e.starvable2().satietyAdd(w, 100, e);
                    e.player().controlUpdate(w, e);
                }, null, null)
            ],
            ["Gain Ability", effectMessageNotImplemented],
            ["Gain Energy", effectMessageNotImplemented],
            [
                "Gain Level",
                new Effect2((uwpe) => {
                    var w = uwpe.world;
                    var e = uwpe.entity;
                    e.demographics().rank += 1;
                    e.player().controlUpdate(w, e);
                }, null, null)
            ],
            [
                "Healing",
                new Effect2((uwpe) => {
                    var w = uwpe.world;
                    var e = uwpe.entity;
                    e.killable().integrityAdd(10);
                    e.player().controlUpdate(w, e);
                }, null, null)
            ],
            [
                "Healing Extra",
                new Effect2((uwpe) => {
                    var w = uwpe.world;
                    var e = uwpe.entity;
                    e.killable().integrityAdd(30);
                    e.player().controlUpdate(w, e);
                }, null, null)
            ],
            [
                "Healing Full",
                new Effect2((uwpe) => {
                    var w = uwpe.world;
                    var e = uwpe.entity;
                    e.killable().integrityAdd(1000);
                    e.player().controlUpdate(w, e);
                }, null, null)
            ],
            ["Invisibility", effectMessageNotImplemented],
            ["Levitation", effectMessageNotImplemented],
            ["Monster Detection", effectMessageNotImplemented],
            ["Paralysis", effectMessageNotImplemented],
            ["Object Detection", effectMessageNotImplemented],
            ["Oil", effectMessageNotImplemented],
            ["Polymorph", effectMessageNotImplemented],
            ["Restore Ability", effectMessageNotImplemented],
            ["See Invisible", effectMessageNotImplemented],
            [
                "Sickness",
                new Effect2((uwpe) => {
                    var w = uwpe.world;
                    var e = uwpe.entity;
                    e.killable().integrityAdd(-20);
                    e.player().controlUpdate(w, e);
                }, null, null)
            ],
            ["Sleeping", effectMessageNotImplemented],
            ["Speed", effectMessageNotImplemented],
            ["Water", effectMessageNotImplemented],
        ];
        var appearances = [
            "Ruby", "Pink", "Orange", "Yellow",
            "Emerald", "Dark Green", "Sky Blue", "Cyan",
            "Brilliant Blue", "Magenta", "Purple-Red", "Puce",
            "Milky", "Swirly", "Bubbly", "Smoky",
            "Cloudy", "Effervescent", "Black", "Golden",
            "Brown", "Fizzy", "Dark", "White",
            "Murky", "Clear"
        ];
        var entityDefnSetPotions = [];
        var categoryNamesPotion = ["Potion"];
        var useItemPotion = (uwpe) => {
            var world = uwpe.world;
            var entityUsing = uwpe.entity;
            var entityUsed = uwpe.entity2;
            var item = entityUsed.item();
            var itemHolder = entityUsing.itemHolder();
            itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var message = null;
            var player = entityUsing.player();
            if (player != null) {
                var itemDefn = item.defn(world);
                message = "You drink the " + itemDefn.appearance + ".";
                player.messageLog.messageAdd(message);
                var effectable = entityUsing.effectable2();
                var effector = entityUsed.effector();
                effectable.effectorApply(effector);
                effectable.updateForTurn(uwpe);
            }
            return message;
        };
        for (var i = 0; i < namesAndEffectDefnsOfPotions.length; i++) {
            var itemDefnName = "Potion of " + name;
            var appearanceIndex = Math.floor(this.randomizer.getNextRandom()
                * appearances.length);
            var appearance = appearances[appearanceIndex] + " Potion";
            ArrayHelper.removeAt(appearances, appearanceIndex);
            var potionData = namesAndEffectDefnsOfPotions[i];
            var name = potionData[0];
            var effect = potionData[1];
            var relativeFrequency = 1; // todo
            var visual = visualGetByName(appearance);
            var effector = new Effector([effect]);
            var itemDefnToEntity = (uwpe, i) => {
                var returnValue = this.itemDefnToEntity(uwpe, i);
                returnValue.propertyAdd(effector);
                return returnValue;
            };
            var itemDefn = new ItemDefn(itemDefnName, appearance, appearance, // description
            1, // mass
            1, // tradeValue
            1, // stackSizeMax,
            categoryNamesPotion, useItemPotion, visual, itemDefnToEntity);
            var entityDefn = new Entity2(itemDefnName, [
                this.mappableDefns.Open,
                Drawable.fromVisual(visual),
                effector,
                itemDefn,
                new Generatable(relativeFrequency)
            ]);
            entityDefnSetPotions.push(entityDefn);
        }
        entityDefnSets.push(entityDefnSetPotions);
        return new EntityDefnGroup("Potions", 1, entityDefnSets[0]);
    }
    buildEntityDefns_Rings(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        // items - magic - rings
        var effectPreventHunger = new Effect2(null, // start
        (uwpe) => // update
         {
            var entityToApplyTo = uwpe.entity;
            entityToApplyTo.starvable2().satietyAdd(uwpe.world, 1, uwpe.entity);
        }, null // finish
        );
        var equipTodo = (uwpe) => {
            var entityEquippable = uwpe.entity;
            entityEquippable.effectable2().effects.push(effectPreventHunger);
        };
        var namesOfRings = [
            new Ring("Adornment", equipTodo),
            new Ring("Aggravate Monster", equipTodo),
            new Ring("Conflict", equipTodo),
            new Ring("Free Action", equipTodo),
            new Ring("Gain Constitution", equipTodo),
            new Ring("Gain Strength", equipTodo),
            new Ring("Hunger", equipTodo),
            new Ring("Increase Accuracy", equipTodo),
            new Ring("Increase Damage", equipTodo),
            new Ring("Invisibility", equipTodo),
            new Ring("Levitation", equipTodo),
            new Ring("Polymorph", equipTodo),
            new Ring("Polymorph Control", equipTodo),
            new Ring("Protection", equipTodo),
            new Ring("Protection from Shape Changers", equipTodo),
            new Ring("Regeneration", equipTodo),
            new Ring("Resist Cold", equipTodo),
            new Ring("Resist Shock", equipTodo),
            new Ring("Resist Fire", equipTodo),
            new Ring("Resist Posion", equipTodo),
            new Ring("Searching", equipTodo),
            new Ring("See Invisible", equipTodo),
            new Ring("Slow Digestion", equipTodo),
            new Ring("Stealth", equipTodo),
            new Ring("Sustain Ability", equipTodo),
            new Ring("Teleport", equipTodo),
            new Ring("Teleport Control", equipTodo),
            new Ring("Warning", equipTodo), // 27
        ];
        var appearances = [
            "Pearl", "Iron", "Twisted", "Steel",
            "Wire", "Engagement", "Shiny", "Bronze",
            "Brass", "Copper", "Silver", "Gold",
            "Wooden", "Granite", "Opal", "Clay",
            "Coral", "Black Onyx", "Moonstone", "Tiger Eye",
            "Jade", "Agate", "Topaz", "Sapphire",
            "Ruby", "Diamond", "Ivory", "Emerald",
        ];
        var entityDefnSetRings = [];
        for (var i = 0; i < namesOfRings.length; i++) {
            var name = "Ring of " + namesOfRings[i];
            var appearanceIndex = Math.floor(this.randomizer.getNextRandom() * appearances.length);
            var appearance = appearances[appearanceIndex] + " Ring";
            ArrayHelper.removeAt(appearances, appearanceIndex);
            var visual = visualGetByName(appearance);
            entityDefnSetRings.push(new Entity2(name, [
                this.mappableDefns.Open,
                Drawable.fromVisual(visual),
                new ItemDefn(name, appearance, appearance, 1, // mass
                1, // tradeValue
                1, // stackSizeMax
                [Ring.name], // categoryNames
                null, //ItemDefn.UseEquip
                visual, this.itemDefnToEntity),
                new Generatable(1), // todo
            ]));
        }
        entityDefnSets.push(entityDefnSetRings);
        return new EntityDefnGroup("Rings", 1, entityDefnSets[0]);
    }
    buildEntityDefns_Scrolls(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var useScrollBlank = (uwpe) => {
            var message = "You can't read a blank scroll!";
            var player = uwpe.entity.player();
            if (player != null) {
                var messageLog = player.messageLog;
                messageLog.messageAdd(message);
            }
            return message;
        };
        var useScrollEffect = (uwpe, effect) => {
            var world = uwpe.world;
            var entityUsing = uwpe.entity;
            var entityUsed = uwpe.entity2;
            var item = entityUsed.item();
            var itemHolder = entityUsing.itemHolder();
            itemHolder.itemSubtractDefnNameAndQuantity(item.defnName, 1);
            var message = null;
            var player = entityUsing.player();
            if (player != null) {
                var itemDefn = item.defn(world);
                message =
                    "The "
                        + itemDefn.appearance
                        + " disappears as you read it.";
                var messageLog = player.messageLog;
                if (effect == null) {
                    // todo
                }
                else {
                    var effectable = entityUsing.effectable2();
                    effectable.effectApply(effect);
                    effectable.updateForTurn(uwpe);
                    // message = "Something happens."
                }
                messageLog.messageAdd(message);
            }
            return message;
        };
        var useScrollNotImplemented = (uwpe) => {
            useScrollEffect(uwpe, null);
        };
        var scrolls = [
            new Scroll("Amnesia", useScrollNotImplemented),
            new Scroll("Blank", useScrollBlank),
            new Scroll("Charging", useScrollNotImplemented),
            new Scroll("Confuse Monster", useScrollNotImplemented),
            new Scroll("Create Monster", useScrollNotImplemented),
            new Scroll("Destroy Armor", useScrollNotImplemented),
            new Scroll("Detect Food", useScrollNotImplemented),
            new Scroll("Detect Gold", useScrollNotImplemented),
            new Scroll("Earth", useScrollNotImplemented),
            new Scroll("Enchant Armor", useScrollNotImplemented),
            new Scroll("Enchant Weapon", useScrollNotImplemented),
            new Scroll("Fire", useScrollNotImplemented),
            new Scroll("Genocide", useScrollNotImplemented),
            new Scroll("Identify", useScrollNotImplemented),
            new Scroll("Light", useScrollNotImplemented),
            new Scroll("Mapping", useScrollNotImplemented),
            new Scroll("Punishment", useScrollNotImplemented),
            new Scroll("Remove Curse", useScrollNotImplemented),
            new Scroll("Scare Monster", useScrollNotImplemented),
            new Scroll("Stinking Cloud", useScrollNotImplemented),
            new Scroll("Taming", useScrollNotImplemented),
            new Scroll("Teleport", useScrollNotImplemented),
        ];
        var appearances = [
            "Andova Begarin", "Daiyen Fooels", "Duam Xnaht", "Eblib Yloh",
            "Elam Ebow", "Foobie Bletch", "Garven Deh", "Hackem Muche",
            "Juyed Awk Yacc", "Kernod Wel", "Kirje", "Lep Gex Ven Zea",
            "NR 9", "Pratyavayah", "Prirutsenie", "Read Me",
            "Temov", "Tharr", "Ve Forbryderne", "Velox Neb",
            "Venzar Borgavve", "Verr Yed Horre", "Xixaxa Xoxaxa Xuxaxa", "Yum Yum",
            "Zelgo Mer",
        ];
        var entityDefnSetScrolls = [];
        var categoryNamesScroll = [Scroll.name];
        var mass = 1; // todo
        for (var i = 0; i < scrolls.length; i++) {
            var scroll = scrolls[i];
            var name = "Scroll of " + scroll.name;
            var appearance = ArrayHelper.random(appearances, this.randomizer);
            ArrayHelper.remove(appearances, appearance);
            appearance = "Scroll of '" + appearance + "'";
            var visual = visualGetByName(appearance);
            var entityDefn = new Entity2(name, [
                this.mappableDefns.Open,
                Drawable.fromVisual(visual),
                new ItemDefn(name, appearance, appearance, // description
                mass, 1, // tradeValue
                1, // stackSizeMax
                categoryNamesScroll, scroll.use, visual, this.itemDefnToEntity),
                new Generatable(1) // todo
            ]);
            entityDefnSetScrolls.push(entityDefn);
        }
        entityDefnSets.push(entityDefnSetScrolls);
        var returnValue = new EntityDefnGroup("Scrolls", 1, entityDefnSetScrolls);
        return returnValue;
    }
    buildEntityDefns_Spellbooks(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var spellNames = [
            // attack
            "Force Bolt",
            "Drain Life",
            "Magic Missile",
            "Cone of Cold",
            "Fireball",
            "Finger of Death",
            // clerical
            "Protection",
            "Create Monster",
            "Remove Curse",
            "Create Familiar",
            "Turn Undead",
            // divination
            "Detect Monsters",
            "Light",
            "Detect Food",
            "Clairvoyance",
            "Detect Unseen",
            "Identify",
            "Detect Treasure",
            "Magic Mapping",
            // enchantment
            "Sleep",
            "Confuse Monster",
            "Slow Monster",
            "Cause Fear",
            "Charm Monster",
            // escape
            "Jumping",
            "Haste",
            "Invisibility",
            "Levitation",
            "Teleport Away",
            // healing
            "Healing",
            "Cure Blindness",
            "Cure Sickness",
            "Extra Healing",
            "Stone to Flesh",
            "Restore Ability",
            // matter
            "Knock",
            "Wizard Lock",
            "Dig",
            "Polymorph",
            "Cancellation", // 39
        ];
        var appearances = [
            "Parchment", "Vellum", "Ragged", "Dogeared",
            "Mottled", "Stained", "Cloth", "Leather",
            "White", "Pink", "Red", "Orange",
            "Yellow", "Velvet", "Light Green", "Dark Green",
            "Turquoise", "Cyan", "Light Blue", "Dark Blue",
            "Indigo", "Magenta", "Purple", "Violet",
            "Tan", "Plaid", "Light Brown", "Dark Brown",
            "Gray", "Wrinkled", "Dusty", "Bronze",
            "Copper", "Silver", "Gold", "Glittering",
            "Shining", "Dull", "Thin", "Thick",
        ];
        var entityDefnSetSpellbooks = [];
        var device = new Device("Spellbook", null, null, // init, update
        null, // this.itemEffectorApply
        null);
        var spellLearn = (uwpe, spellName) => {
            var entityUsing = uwpe.entity;
            var spellCaster = entityUsing.spellCaster();
            var message = spellCaster.spellLearnByName(uwpe, spellName);
            console.log("todo - " + message);
            // todo - Degrade the spellbook?
            // return message;
        };
        var categoryNamesSpellbook = ["Spellbook"];
        for (var i = 0; i < spellNames.length; i++) {
            var nameOfSpell = spellNames[i];
            var itemDefnName = "Spellbook of " + nameOfSpell;
            var appearanceIndex = Math.floor(this.randomizer.getNextRandom()
                * appearances.length);
            var appearance = appearances[appearanceIndex] + " Spellbook";
            ArrayHelper.removeAt(appearances, appearanceIndex);
            var itemUseSpellbook = (uwpe) => {
                var message = spellLearn(uwpe, nameOfSpell);
                console.log("todo - " + message);
                // return message;
            };
            var visual = visualGetByName(appearance);
            var entityDefn = new Entity2(itemDefnName, [
                this.mappableDefns.Open,
                device,
                Drawable.fromVisual(visual),
                new ItemDefn(itemDefnName, appearance, appearance, // description
                1, // mass
                1, // tradeValue
                1, // stackSizeMax
                categoryNamesSpellbook, itemUseSpellbook, visual, this.itemDefnToEntity),
                new Generatable(1) // todo
            ]);
            entityDefnSetSpellbooks.push(entityDefn);
        }
        entityDefnSets.push(entityDefnSetSpellbooks);
        var returnValue = new EntityDefnGroup("Spellbooks", 1, entityDefnSets[0]);
        return returnValue;
    }
    buildEntityDefns_Wands(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var wandUseNotImplemented = (uwpe) => {
            return "Wand effect not implemented!";
        };
        var wandUseProjectileSpawn = (uwpe) => {
            var world = uwpe.world;
            var targetEntity = uwpe.entity2;
            var loc = targetEntity.locatable().loc;
            var venue = loc.place(world);
            var entityDefnForProjectile = world.defn2.entityDefnByName("Rock");
            var entityForProjectile = entityDefnForProjectile.clone(); // todo
            venue.entitiesToSpawn.push(entityForProjectile);
            // todo
            //targetEntity.controlUpdate(world);
            return "todo";
        };
        var wandUseTeleport = (uwpe) => {
            var world = uwpe.world;
            var targetEntity = uwpe.entity2;
            var loc = targetEntity.locatable().loc;
            var teleportPos = null;
            while (teleportPos == null) {
                var placeLevel = loc.place(world);
                var map = placeLevel.map;
                var randomizer = world.randomizer;
                teleportPos = Coords.create().randomize(randomizer).multiply(map.sizeInCells).floor();
                var cellToTeleportTo = map.cellAtPos(teleportPos);
                var cellTerrain = cellToTeleportTo.terrain(map);
                if (cellTerrain.costToTraverse > 100) // hack
                 {
                    teleportPos = null;
                }
            }
            loc.pos.overwriteWith(teleportPos);
            //targetEntity.controllable().controlUpdate(world);
            //targetEntity.player().controlUpdate(world, size, targetEntity);
            return "todo";
        };
        var chargesMaxAsDiceRoll = DiceRoll.fromExpression("2d6");
        var wands = [
            new Wand("Cancelling", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Cold", chargesMaxAsDiceRoll, wandUseProjectileSpawn),
            new Wand("Create Monster", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Death", chargesMaxAsDiceRoll, wandUseProjectileSpawn),
            new Wand("Digging", chargesMaxAsDiceRoll, wandUseTeleport),
            new Wand("Enlightenment", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Fire", chargesMaxAsDiceRoll, wandUseProjectileSpawn),
            new Wand("Light", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Lightning", chargesMaxAsDiceRoll, wandUseProjectileSpawn),
            new Wand("Locking", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Make Invisible", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Magic Missile", chargesMaxAsDiceRoll, wandUseProjectileSpawn),
            new Wand("Nothing", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Opening", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Polymorph", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Probing", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Secret Door Detection", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Sleep", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Slow Monster", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Speed Monster", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Striking", chargesMaxAsDiceRoll, wandUseProjectileSpawn),
            new Wand("Teleport", chargesMaxAsDiceRoll, wandUseTeleport),
            new Wand("Turn Undead", chargesMaxAsDiceRoll, wandUseNotImplemented),
            new Wand("Wishing", chargesMaxAsDiceRoll, wandUseNotImplemented), // 23
        ];
        var appearances = [
            "Glass", "Balsa", "Crystal", "Maple",
            "Pine", "Oak", "Ebony", "Marble",
            "Tin", "Brass", "Copper", "Silver",
            "Platinum", "Iridium", "Zinc", "Aluminum",
            "Uranium", "Iron", "Steel", "Hexagonal",
            "Short", "Runed", "Long", "Curved",
            "Forked", "Spiked", "Jeweled",
        ];
        var entityDefnSetWands = [];
        for (var i = 0; i < wands.length; i++) {
            var wand = wands[i];
            var name = wand.name;
            var wandName = "Wand of " + name;
            var appearanceIndex = Math.floor(this.randomizer.getNextRandom() * appearances.length);
            var appearance = appearances[appearanceIndex] + " Wand";
            ArrayHelper.removeAt(appearances, appearanceIndex);
            var visual = visualGetByName(appearance);
            var itemDefnToEntity = (uwpe, item) => {
                var returnValue = this.itemDefnToEntity(uwpe, item);
                returnValue.propertyAdd(wand);
                return returnValue;
            };
            var itemDefn = new ItemDefn(wandName, appearance, appearance, // description
            1, // mass
            1, // tradeValue
            1, // stackSizeMax
            [Wand.name], // categoryNames
            wand.use, // use
            visual, itemDefnToEntity);
            var entityDefnWand = new Entity2(wandName, [
                this.mappableDefns.Open,
                Drawable.fromVisual(visual),
                itemDefn,
                new Generatable(1),
                wand
            ]);
            entityDefnSetWands.push(entityDefnWand);
        }
        entityDefnSets.push(entityDefnSetWands);
        return new EntityDefnGroup("Wands", 1, entityDefnSets[0]);
    }
    buildEntityDefns_MagicTools(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        // todo
        return null;
    }
    buildEntityDefns_Weapons(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var diceRollDefault = DiceRoll.fromExpression("1d6"); // todo
        var weapons = [
            new Weapon2("Arrow", "Arrow", diceRollDefault),
            new Weapon2("Battle Axe", "Battle Axe", diceRollDefault),
            new Weapon2("Bow", "Bow", diceRollDefault),
            new Weapon2("Bow2", "Bow2", diceRollDefault),
            new Weapon2("Bow3", "Bow3", diceRollDefault),
            new Weapon2("Bow4", "Bow4", diceRollDefault),
            new Weapon2("Sling", "Sling", diceRollDefault),
            new Weapon2("Crossbow", "Crossbow", diceRollDefault),
            new Weapon2("Crossbow Bolt", "Crossbow Bolt", diceRollDefault),
            new Weapon2("Dagger", "Dagger", diceRollDefault),
            new Weapon2("Dart", "Dart", diceRollDefault),
            new Weapon2("Elven Dagger", "Runed Dagger", diceRollDefault),
            new Weapon2("Hand Axe", "Hand Axe", diceRollDefault),
            new Weapon2("Knife", "Knife", diceRollDefault),
            new Weapon2("Orcish Dagger", "Crude Dagger", diceRollDefault),
            new Weapon2("Polearm1", "Polearm1", diceRollDefault),
            new Weapon2("Short Sword", "Short Sword", diceRollDefault),
            new Weapon2("Silver Arrow", "Silver Arrow", diceRollDefault),
        ];
        var entityDefnSetWeapons = [];
        var equippable = Equippable.default();
        var itemDefnToEntity = (uwpe, i) => {
            var returnValue = this.itemDefnToEntity(uwpe, i);
            returnValue.propertyAdd(weapon);
            returnValue.propertyAdd(weapon.damager);
            return returnValue;
        };
        for (var i = 0; i < weapons.length; i++) {
            var weapon = weapons[i];
            var name = weapon.name;
            var appearance = weapon.appearance;
            var visual = visualGetByName(name);
            var entityDefn = new Entity2(name, [
                this.mappableDefns.Open,
                Drawable.fromVisual(visual),
                equippable,
                new Generatable(1),
                new ItemDefn(name, appearance, appearance, 1, // mass
                1, // tradeValue
                1, // stackSizeMax
                ["Weapon"], // categoryNames
                null, visual, itemDefnToEntity),
                weapon
            ]);
            entityDefnSetWeapons.push(entityDefn);
        }
        ;
        //entityDefnSets["Group_Weapons"] = (entityDefnSetWeapons as any);
        entityDefnSets.push(entityDefnSetWeapons);
        return new EntityDefnGroup("Weapons", 1, entityDefnSets[0]);
    }
    buildEntityDefns_Armor(visualGetByName, categoriesByName, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var headwear = categoriesByName.get("Headwear");
        var bodyArmor = categoriesByName.get("BodyArmor");
        var shirt = categoriesByName.get("Shirt");
        var cloak = categoriesByName.get("Cloak");
        var footwear = categoriesByName.get("Footwear");
        var shield = categoriesByName.get("Shield");
        var namesAndCategoriesOfArmor = [
            ["Elven Leather Helmet", headwear],
            ["Orcish Helmet", headwear],
            ["Dwarvish Helmet", headwear],
            ["Black Hat", headwear],
            ["Cornuthaum", headwear],
            ["Dunce Cap", headwear],
            ["Cooking Pot", headwear],
            ["Plumed Helmet", headwear],
            ["Etched Helmet", headwear],
            ["Crested Helmet", headwear],
            ["Visored Helmet", headwear],
            ["Plate Mail", bodyArmor],
            ["Crystal Plate Mail", bodyArmor],
            ["Bronze Plate Mail", bodyArmor],
            ["Armor1", bodyArmor],
            ["Armor2", bodyArmor],
            ["Elven Mithril Shirt", bodyArmor],
            ["Dwarven Mithril Shirt", bodyArmor],
            ["Armor3", bodyArmor],
            ["Orcish Chain Mail", bodyArmor],
            ["Armor4", bodyArmor],
            ["Studded Leather Armor", bodyArmor],
            ["Armor5", bodyArmor],
            ["Armor6", bodyArmor],
            ["Leather Armor", bodyArmor],
            ["Leather Jacket", bodyArmor],
            ["Hawaiian Shirt", shirt],
            ["Tee Shirt", shirt],
            ["Mummy Wrapping", cloak],
            ["Elven Cloak", cloak],
            ["Leather Cloak", cloak],
            ["Hooded Cloak", cloak],
            ["Oilskin Cloak", cloak],
            ["Robe", cloak],
            ["Apron", cloak],
            ["Leather Cloak 2", cloak],
            ["Tattered Cloak", cloak],
            ["Opera Cloak", cloak],
            ["Ornamental Cope", cloak],
            ["Piece of Cloth", cloak],
            ["Low Boots", footwear],
            ["Dwarven Boots", footwear],
            ["High Boots", footwear],
            ["Combat Boots", footwear],
            ["Jungle Boots", footwear],
            ["Elven Boots", footwear],
            ["Mud Boots", footwear],
            ["Buckled Boots", footwear],
            ["Riding Boots", footwear],
            ["Snow Boots", footwear],
            ["Polished Shield", shield],
            ["Small Round Shield", shield],
        ];
        var entityDefnSetArmor = [];
        var equippable = Equippable.default();
        for (var i = 0; i < namesAndCategoriesOfArmor.length; i++) {
            var nameAndCategory = namesAndCategoriesOfArmor[i];
            var name = nameAndCategory[0];
            var appearance = name; // hack
            var category = nameAndCategory[1];
            var visual = visualGetByName(name);
            var entityDefn = new Entity2(name, [
                this.mappableDefns.Open,
                Drawable.fromVisual(visual),
                equippable,
                new ItemDefn(appearance, appearance, appearance, 1, // mass
                1, // tradeValue
                1, // stackSizeMax
                ["Armor", category.name], // categoryNames
                null, // use
                visual, this.itemDefnToEntity),
                new Generatable(1) // todo
            ]);
            entityDefnSetArmor.push(entityDefn);
        }
        ;
        entityDefnSets.push(entityDefnSetArmor);
        //entityDefnSets["Group_Armor"] = (entityDefnSetArmor as any);
        return new EntityDefnGroup("Armor", 1, entityDefnSets[0]);
    }
    buildEntityDefns_Tools(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var entityDefnSet = [];
        var namesAndAppearances = [
            ["Key",],
            ["Lockpick"],
            ["Credit Card"],
            ["Candle"],
            ["Candle2"],
            ["Lantern"],
            ["Oil Lamp"],
            ["Magic Lamp"],
            ["Expensive Camera"],
            ["Mirror"],
            ["Crystal Orb"],
            ["Eyeglasses"],
            ["Blindfold"],
            ["Towel"],
            ["Saddle"],
            ["Leash"],
            ["Stethoscope"],
            ["Tinning Kit"],
            ["Tin Opener"],
            ["Can of Grease"],
            ["Figurine"],
            ["Magic Marker"],
            ["Unarmed Land Mine"],
            ["Unarmed Bear Trap"],
            ["Tin Whistle"],
            ["Magic Whistle"],
            ["Flute"],
            ["Flute2"],
            ["Tooled Horn"],
            ["Horn of Cold"],
            ["Horn of Plenty"],
            ["Horn4"],
            ["Harp"],
            ["Harp2"],
            ["Bell"],
            ["Trumpet"],
            ["Drum"],
            ["Earthquake Drum"],
            ["Pickaxe"],
            ["Grappling Hook"],
            ["Unicorn Horn"],
            ["Candelabra"],
            ["Bell of Opening"],
        ];
        for (var i = 0; i < namesAndAppearances.length; i++) {
            var nameAndAppearance = namesAndAppearances[i];
            var name = nameAndAppearance[0];
            var appearance = nameAndAppearance[0]; // hack
            var visual = visualGetByName(name);
            var entityDefn = new Entity2(name, [
                this.mappableDefns.Open,
                Drawable.fromVisual(visual),
                new ItemDefn(appearance, appearance, appearance, 1, // mass
                1, // tradeValue
                1, // stackSizeMax
                [Tool.name], // categoryNames
                null, // use
                visual, this.itemDefnToEntity),
                new Generatable(1) // todo
            ]);
            entityDefnSet.push(entityDefn);
        }
        ;
        return new EntityDefnGroup("Tools", 1, entityDefnSet);
    }
    buildEntityDefns_Stones(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var namesOfStones = [
            // precious stones
            "Dilithium Crystal",
            "Diamond",
            "Ruby",
            "Jacinth",
            "Sapphire",
            "Black Opal",
            "Emerald",
            "Turqoise",
            "Citrine",
            "Aquamarine",
            "Piece of Amber",
            "Topaz",
            "Piece of Jet",
            "Opal",
            "Chrysoberyl",
            "Garnet",
            "Amethyst",
            "Jasper",
            "Piece of Fluorite",
            "Piece of Jade",
            "Piece of Obsidian",
            "Agate",
            // glass
            "White Glass",
            "Blue Glass",
            "Red Glass",
            "Yellowish Brown Glass",
            "Orange Glass",
            "Yellow Glass",
            "Black Glass",
            "Green Glass",
            "Violet Glass",
            // gray stones
            "Luckstone",
            "Loadstone",
            "Touchstone",
            "Flint",
            // rock
            "Rock" // 35
        ];
        var appearancesOfStones = [
            "White Gem", "White Gem", "Red Gem", "Orange Gem",
            "Blue Gem", "Black Gem", "Green Gem", "Green Gem",
            "Yellow Gem", "Green Gem", "Brownish Gem", "Brownish Gem",
            "Black Gem", "White Gem", "Yellow Gem", "Red Gem",
            "Violet Gem", "Red Gem", "Violet Gem", "Black Gem",
            "Orange Gem", "Green Gem", "White Gem", "Blue Gem",
            "Red Gem", "Brownish Gem", "Orange Gem", "Yellow Gem",
            "Black Gem", "Green Gem", "Violet Gem", "Gray Stone",
            "Gray Stone", "Gray Stone", "Gray Stone", "Rock"
        ];
        var entityDefnSetStones = [];
        var mappableDefnOpen = this.mappableDefns.Open;
        var damager = new Damager(Damage.fromAmount(1));
        var itemDefnToEntity = (uwpe, item) => {
            var itemDefn = item.defn(uwpe.world);
            var returnValue = new Entity2(item.defnName, [
                item,
                uwpe.entity.locatable().clone(),
                new Mappable(mappableDefnOpen),
                mappableDefnOpen,
                damager,
                Drawable.fromVisual(itemDefn.visual),
            ]);
            return returnValue;
        };
        for (var i = 0; i < namesOfStones.length; i++) {
            var name = namesOfStones[i];
            var appearance = appearancesOfStones[i];
            var visual = visualGetByName(appearance);
            var itemDefn = new ItemDefn(name, appearance, appearance, 1, // mass
            1, // tradeValue
            1, // stackSizeMax
            [Stone.name], // categoryNames
            null, // use
            null, itemDefnToEntity);
            entityDefnSetStones.push(new Entity2(name, [
                mappableDefnOpen,
                Drawable.fromVisual(visual),
                new Generatable(1),
                itemDefn
            ]));
        }
        entityDefnSets.push(entityDefnSetStones);
        // entityDefnSets["Group_Stones"] = (entityDefnSetStones as any);
        return new EntityDefnGroup("Stones", 1, entityDefnSetStones);
    }
    buildEntityDefns_Valuables(visualGetByName, categories, categoriesCommon, sizeInPixels, itemPropertiesNoStack, itemPropertiesStandard, effectDoNothing, entityDefnSets) {
        var entityDefnSetValuables = [];
        var name = "Coins";
        var visual = visualGetByName("Coins");
        entityDefnSetValuables.push(new Entity2(name, [
            itemPropertiesStandard,
            Drawable.fromVisual(visual),
            new Generatable(0),
            new ItemDefn(name, name, name, 1, // mass
            1, // tradeValue
            10000, // stackSizeMax
            ["Valuables"], // categoryNames
            null, // use
            visual, this.itemDefnToEntity)
        ]));
        entityDefnSets.push(entityDefnSetValuables);
        // entityDefnSets["Group_Valuables"] = (entityDefnSetValuables as any);
        var returnGroup = new EntityDefnGroup("Valuables", 0, entityDefnSetValuables);
        return returnGroup;
    }
    buildItemCategories() {
        var returnValues = [
            new ItemCategory("Headwear"),
            new ItemCategory("Neckwear"),
            new ItemCategory("Shirt"),
            new ItemCategory("BodyArmor"),
            new ItemCategory("Cloak"),
            new ItemCategory("Glove"),
            new ItemCategory("Footwear"),
            new ItemCategory("Shield"),
            new ItemCategory("Armor"),
            new ItemCategory("Food"),
            new ItemCategory("Potion"),
            new ItemCategory("Ring"),
            new ItemCategory("Scroll"),
            new ItemCategory("Spellbook"),
            new ItemCategory("Tool"),
            new ItemCategory("Wand"),
            new ItemCategory("Weapon"),
            new ItemCategory("Ammunition"),
        ];
        //var returnValuesByName = ArrayHelper.addLookupsByName(returnValues);
        return returnValues;
    }
    itemDefnToEntity(uwpe, item) {
        var itemDefn = item.defn(uwpe.world);
        var mappableDefn = MappableDefn.Instances().Open;
        var returnValue = new Entity2(item.defnName, [
            item,
            uwpe.entity.locatable().clone(),
            new Mappable(mappableDefn),
            mappableDefn,
            Drawable.fromVisual(itemDefn.visual),
        ]);
        return returnValue;
    }
    itemUseDevice(uwpe) {
        var world = uwpe.world;
        var userEntity = uwpe.entity;
        var itemEntity = uwpe.entity2;
        var itemAppearance = itemEntity.item().defn(world).appearance;
        var itemMessage = "You use the " + itemAppearance + ".";
        var device = itemEntity.device();
        var deviceMessage = "todo";
        // todo
        device.use(uwpe);
        var player = userEntity.player();
        if (player != null) {
            player.messageLog.messageAdd(itemMessage);
            player.messageLog.messageAdd(deviceMessage);
        }
        var message = itemMessage + " " + deviceMessage;
        return message;
    }
}
// Convenience classes.
class Amulet {
}
class Food {
    constructor(name, satiety, weight) {
        this.name = name;
        this.satiety = satiety;
        this.weight = weight;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
class Ring {
    constructor(name, use) {
        this.name = name;
        this.use = use;
    }
}
class Scroll {
    constructor(name, use) {
        this.name = name;
        this.use = use;
    }
}
class Stone {
}
class Tool {
}
class Wand {
    constructor(name, chargesMaxAsDiceRoll, use) {
        this.name = name;
        this.chargesMaxAsDiceRoll = chargesMaxAsDiceRoll;
        this.use = use;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) {
        if (this.charges == null) {
            var randomizer = uwpe.universe.randomizer;
            this.charges = this.chargesMaxAsDiceRoll.roll(randomizer);
        }
    }
    updateForTimerTick(uwpe) { }
}
class Weapon2 {
    constructor(name, appearance, damagePossibleAsDiceRoll) {
        this.name = name;
        this.appearance = appearance;
        this.damagePossibleAsDiceRoll = damagePossibleAsDiceRoll;
        var damagePerHit = Damage.fromAmountAsDiceRoll(damagePossibleAsDiceRoll);
        this.damager = new Damager(damagePerHit);
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
