var gf = ThisCouldBeBetter.GameFramework;

// hack
// These classes currently have to come first.

var RandomizerLCG = gf.RandomizerLCG;
var EntityProperty = gf.EntityProperty;

// Helpers.

var ArrayHelper = gf.ArrayHelper;
var NumberHelper = gf.NumberHelper;
var StringHelper = gf.StringHelper;

// Controls.

var ControlActionNames = gf.ControlActionNames;
var ControlBase = gf.ControlBase;
var ControlBuilder = gf.ControlBuilder;
var ControlButton = gf.ControlButton;
var ControlContainer = gf.ControlContainer;
var ControlContainerTransparent = gf.ControlContainerTransparent;
var ControlLabel = gf.ControlLabel;
var ControlList = gf.ControlList;
var ControlNone = gf.ControlNone;
var ControlScrollbar = gf.ControlScrollbar;
var ControlSelect = gf.ControlSelect;
var ControlSelectOption = gf.ControlSelectOption;
var ControlStyle = gf.ControlStyle;
var ControlTabbed = gf.ControlTabbed;
var ControlTextBox = gf.ControlTextBox;
var ControlVisual = gf.ControlVisual;
var Controllable = gf.Controllable;
var DataBinding = gf.DataBinding;
var VenueControls = gf.VenueControls;
var VenueMessage = gf.VenueMessage;

// Display.

var Color = gf.Color;
var Display2D = gf.Display2D;
var DisplayRecorder = gf.DisplayRecorder;
var Drawable = gf.Drawable;
var VenueFader = gf.VenueFader;
var VenueLayered = gf.VenueLayered;

// Display - Visuals.

var VisualAnchor = gf.VisualAnchor;
var VisualArc = gf.VisualArc;
var VisualCameraProjection = gf.VisualCameraProjection;
var VisualCircle = gf.VisualCircle;
var VisualDirectional = gf.VisualDirectional;
var VisualDynamic = gf.VisualDynamic;
var VisualEllipse = gf.VisualEllipse;
var VisualGroup = gf.VisualGroup;
var VisualImageFromLibrary = gf.VisualImageFromLibrary;
var VisualImageImmediate = gf.VisualImageImmediate;
var VisualImageScaled = gf.VisualImageScaled;
var VisualMap = gf.VisualMap;
var VisualNone = gf.VisualNone;
var VisualOffset = gf.VisualOffset;
var VisualPolygon = gf.VisualPolygon;
var VisualRectangle = gf.VisualRectangle;
var VisualRepeating = gf.VisualRepeating;
var VisualSelect = gf.VisualSelect;
var VisualText = gf.VisualText;

// Display - Visuals - Animation.

var VisualAnimation = gf.VisualAnimation;

// Geometry.

var Camera = gf.Camera;
var Collision = gf.Collision;
var CollisionHelper = gf.CollisionHelper;
var Constraint = gf.Constraint;
var Coords = gf.Coords;
var Direction = gf.Direction;
	var Direction_Instances = gf.Direction_Instances;
var Disposition = gf.Disposition;
var Orientation = gf.Orientation;
var Polar = gf.Polar;
var Quaternion = gf.Quaternion;
var RangeExtent = gf.RangeExtent;
var Rotation = gf.Rotation;

// Geometry - Shapes.

var Arc = gf.Arc;
var Box = gf.Box;
var BoxRotated = gf.BoxRotated;
var Cylinder = gf.Cylinder;
var Edge = gf.Edge;
var Face = gf.Face;
var Hemispace = gf.Hemispace;
var Path = gf.Path;
var Plane = gf.Plane;
var Ray = gf.Ray;
var ShapeContainer = gf.ShapeContainer;
var ShapeGroupAll = gf.ShapeGroupAll;
var ShapeGroupAny = gf.ShapeGroupAny;
var ShapeInverse = gf.ShapeInverse;
var Shell = gf.Shell;
var Sphere = gf.Sphere;
var Wedge = gf.Wedge;

// Geometry - Shapes - Maps.

var MapLocated = gf.MapLocated;

// Geometry - Shapes - Meshes.

var Mesh = gf.Mesh;

// Geometry - Transforms.

var Transform = gf.Transform;
var Transform_Locate = gf.Transform_Locate;
var Transform_Orient = gf.Transform_Orient;
var Transform_OrientRDF = gf.Transform_OrientRDF;
var Transform_Translate = gf.Transform_Translate;

// Input.

var ActionToInputsMapping = gf.ActionToInputsMapping;
var Input = gf.Input;
var InputHelper = gf.InputHelper;

// Media.

var Font = gf.Font;
var Image = gf.Image;
var ImageBuilder = gf.ImageBuilder;
var MediaLibrary = gf.MediaLibrary;
var Sound = gf.Sound;
var SoundHelper = gf.SoundHelper;
var TextString = gf.TextString;
var VenueVideo = gf.VenueVideo;
var Video = gf.Video;
var VideoHelper = gf.VideoHelper;
var VisualSound = gf.VisualSound;

// Model.

var Entity = gf.Entity;
var EntityBuilder = gf.EntityBuilder;
var Goal = gf.Goal;
var Playable = gf.Playable;
var Universe = gf.Universe;
var VenueWorld = gf.VenueWorld;
var World = gf.World;
var WorldDefn = gf.WorldDefn;

// Model - Actors.

var Action = gf.Action;
var Actor = gf.Actor;

// Model - Combat.

var Damage = gf.Damage;
var Damager = gf.Damager;
var Killable = gf.Killable;

// Model - Items.

var Item = gf.Item;
var ItemBarterer = gf.ItemBarterer;
var ItemDefn = gf.ItemDefn;
var ItemHolder = gf.ItemHolder;

// Model - Items - Crafting.

var ItemCrafter = gf.ItemCrafter;

// Model - Items - Equipment.

var EquipmentSocket = gf.EquipmentSocket;
var EquipmentSocketDefn = gf.EquipmentSocketDefn;
var EquipmentSocketDefnGroup = gf.EquipmentSocketDefnGroup;
var EquipmentSocketGroup = gf.EquipmentSocketGroup;
var EquipmentUser = gf.EquipmentUser;
var Equippable = gf.Equippable;
var ItemCategory = gf.ItemCategory;

// Model - Journal.

var JournalKeeper = gf.JournalKeeper;

// Model - Mortality.

var Ephemeral = gf.Ephemeral;

// Model - Physics.

var Collidable = gf.Collidable;
var Constrainable = gf.Constrainable;
var Locatable = gf.Locatable;

// Model - Places.

var Place = gf.Place;
var PlaceDefn = gf.PlaceDefn;

// Model - Skills.

var SkillLearner = gf.SkillLearner;

// Model - Talk.

var ConversationDefn = gf.ConversationDefn;
var ConversationRun = gf.ConversationRun;
var ConversationScope = gf.ConversationScope;
var TalkNode = gf.TalkNode;
var TalkNodeDefn = gf.TalkNodeDefn;
var Talker = gf.Talker;

// Model - Usables.

var Device = gf.Device;

// Profiles.

var Profile = gf.Profile;

// Storage.

var FileHelper = gf.FileHelper;
var Serializer = gf.Serializer;
var StorageHelper = gf.StorageHelper;
var VenueFileUpload = gf.VenueFileUpload;

// Storage - Compressor.

var BitStream = gf.BitStream;
var ByteStreamFromString = gf.ByteStreamFromString;
var CompressorLZW = gf.CompressorLZW;

// Utility.

var DateTime = gf.DateTime;
var DiceRoll = gf.DiceRoll;
var IDHelper = gf.IDHelper;
var PlatformHelper = gf.PlatformHelper;
var RandomizerSystem = gf.RandomizerSystem;
var Reference = gf.Reference;
var Stopwatch = gf.Stopwatch;
var TimerHelper = gf.TimerHelper;
var URLParser = gf.URLParser;
var VenueTask = gf.VenueTask;