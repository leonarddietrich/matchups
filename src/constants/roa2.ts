/**
 * Rivals of Aether 2 Constants
 */

// Import all character portraits
import AbsaPortrait from '@/assets/roa2/characters/RoA2_Absa_Portrait.png';
import ClairenPortrait from '@/assets/roa2/characters/RoA2_Clairen_Portrait.png';
// import EllianaPortrait from '@/assets/roa2/characters/RoA2_Elliana_Portrait.png';
import EtalusPortrait from '@/assets/roa2/characters/RoA2_Etalus_Portrait.png';
import FleetPortrait from '@/assets/roa2/characters/RoA2_Fleet_Portrait.png';
import ForsburnPortrait from '@/assets/roa2/characters/RoA2_Forsburn_Portrait.png';
// import HodanPortrait from '@/assets/roa2/characters/RoA2_Hodan_Portrait.png';
import KraggPortrait from '@/assets/roa2/characters/RoA2_Kragg_Portrait.png';
// import LaReinaPortrait from '@/assets/roa2/characters/RoA2_La_Reina_Portrait.png';
import LoxodontPortrait from '@/assets/roa2/characters/RoA2_Loxodont_Portrait.png';
import MaypulPortrait from '@/assets/roa2/characters/RoA2_Maypul_Portrait.png';
// import MolloPortrait from '@/assets/roa2/characters/RoA2_Mollo_Portrait.png';
import OlympiaPortrait from '@/assets/roa2/characters/RoA2_Olympia_Portrait.png';
import OrcanePortrait from '@/assets/roa2/characters/RoA2_Orcane_Portrait.png';
// import PommePortrait from '@/assets/roa2/characters/RoA2_Pomme_Portrait.png';
import RannoPortrait from '@/assets/roa2/characters/RoA2_Ranno_Portrait.png';
// import SylvanosPortrait from '@/assets/roa2/characters/RoA2_Sylvanos_Portrait.png';
import WrastorPortrait from '@/assets/roa2/characters/RoA2_Wrastor_Portrait.png';
import ZetterburnPortrait from '@/assets/roa2/characters/RoA2_Zetterburn_Portrait.png';

// Import all stage images
// Stage PNG fallbacks
import AetherianForestStagePng from '@/assets/roa2/stages/AetherianForest.png';
import AirArmadaStagePng from '@/assets/roa2/stages/AirArmada.png';
import FireCapitalStagePng from '@/assets/roa2/stages/FireCapital.png';
import ForestUnderstoryStagePng from '@/assets/roa2/stages/ForestUnderstory.png';
import GodaiDeltaStagePng from '@/assets/roa2/stages/GodaiDelta.png';
import HodojoStagePng from '@/assets/roa2/stages/Hodojo.png';
import HyperboreanHarborStagePng from '@/assets/roa2/stages/HyperboreanHarbor.png';
import JulesvaleStagePng from '@/assets/roa2/stages/Julesvale.png';
import MerchantPortStagePng from '@/assets/roa2/stages/MerchantPort.png';
import RockWallStagePng from '@/assets/roa2/stages/RockWall.png';
import StormsweptPillarStagePng from '@/assets/roa2/stages/StormsweptPillar.png';
import TempestPeakStagePng from '@/assets/roa2/stages/TempestPeak.png';

// Stage WEBP preferred assets
import AetherianForestStageWebp from '@/assets/roa2/stages/AetherianForest.webp';
import AirArmadaStageWebp from '@/assets/roa2/stages/AirArmada.webp';
import FireCapitalStageWebp from '@/assets/roa2/stages/FireCapital.webp';
import ForestUnderstoryStageWebp from '@/assets/roa2/stages/ForestUnderstory.webp';
import GodaiDeltaStageWebp from '@/assets/roa2/stages/GodaiDelta.webp';
import HodojoStageWebp from '@/assets/roa2/stages/Hodojo.webp';
import HyperboreanHarborStageWebp from '@/assets/roa2/stages/HyperboreanHarbor.webp';
import JulesvaleStageWebp from '@/assets/roa2/stages/Julesvale.webp';
import MerchantPortStageWebp from '@/assets/roa2/stages/MerchantPort.webp';
import RockWallStageWebp from '@/assets/roa2/stages/RockWall.webp';
import StormsweptPillarStageWebp from '@/assets/roa2/stages/StormsweptPillar.webp';
import TempestPeakStageWebp from '@/assets/roa2/stages/TempestPeak.webp';

import type { Rival, Stage, RivalElement } from '@/types/roa2Types';

/**
 * List of characters with their elements and icon paths.
 * The icon paths are relative to the `public` directory.
 */
export const RIVALS: Rival[] = [
	{
		name: 'Forsburn',
		element: 'Fire',
		iconPath: ForsburnPortrait,
		color: '#008000',
	},
	{
		name: 'Loxodont',
		element: 'Earth',
		iconPath: LoxodontPortrait,
		color: '#4B0082',
	},
	{
		name: 'Clairen',
		element: 'Fire',
		iconPath: ClairenPortrait,
		color: '#FF0000',
	},
	{
		name: 'Zetterburn',
		element: 'Fire',
		iconPath: ZetterburnPortrait,
		color: '#FFD700',
	},
	{
		name: 'Olympia',
		element: 'Water',
		iconPath: OlympiaPortrait,
		color: '#FF00FF',
	},
	{
		name: 'Maypul',
		element: 'Earth',
		iconPath: MaypulPortrait,
		color: '#EE82EE',
	},
	{
		name: 'Kragg',
		element: 'Earth',
		iconPath: KraggPortrait,
		color: '#0000FF',
	},
	{
		name: 'Wrastor',
		element: 'Air',
		iconPath: WrastorPortrait,
		color: '#00FFFF',
	},
	{
		name: 'Fleet',
		element: 'Air',
		iconPath: FleetPortrait,
		color: '#FFFF00',
	},
	{
		name: 'Absa',
		element: 'Air',
		iconPath: AbsaPortrait,
		color: '#B0E0E6',
	},
	{
		name: 'Ranno',
		element: 'Water',
		iconPath: RannoPortrait,
		color: '#FF4500',
	},
	{
		name: 'Orcane',
		element: 'Water',
		iconPath: OrcanePortrait,
		color: '#FF1493',
	},
	{
		name: 'Etalus',
		element: 'Water',
		iconPath: EtalusPortrait,
		color: '#FFA500',
	},
	// {
	// 	name: 'Sylvanos',
	// 	element: 'Earth',
	// 	iconPath: SylvanosPortrait,
	// 	color: '#228B22',
	// },
	// {
	// 	name: 'Elliana',
	// 	element: 'Air',
	// 	iconPath: EllianaPortrait,
	// 	color: '#B0E0E6',
	// },
	// {
	// 	name: 'Mollo',
	// 	element: 'Fire',
	// 	iconPath: MolloPortrait,
	// 	color: '#A0522D',
	// },
	// {
	// 	name: 'Hodan',
	// 	element: 'Earth',
	// 	iconPath: HodanPortrait,
	// 	color: '#8B4513',
	// },
	// {
	// 	name: 'Pomme',
	// 	element: 'Air',
	// 	iconPath: PommePortrait,
	// 	color: '#FF69B4',
	// },
	// {
	// 	name: 'La Reina',
	// 	element: 'Fire',
	// 	iconPath: LaReinaPortrait,
	// 	color: '#C71585',
	// },
]

/**
 * List of stages with their icon paths.
 * The icon paths are relative to the `public` directory.
 */
export const STAGES: Stage[] = [
	{
		name: 'Aetherian Forest',
		iconPath: AetherianForestStagePng,
		iconPathWebp: AetherianForestStageWebp,
	},
	{
		name: 'Godai Delta',
		iconPath: GodaiDeltaStagePng,
		iconPathWebp: GodaiDeltaStageWebp,
	},
	{
		name: 'Hodojo',
		iconPath: HodojoStagePng,
		iconPathWebp: HodojoStageWebp,
	},
	{
		name: 'Julesvale',
		iconPath: JulesvaleStagePng,
		iconPathWebp: JulesvaleStageWebp,
	},
	{
		name: 'Merchant Port',
		iconPath: MerchantPortStagePng,
		iconPathWebp: MerchantPortStageWebp,
	},
	{
		name: 'Air Armada',
		iconPath: AirArmadaStagePng,
		iconPathWebp: AirArmadaStageWebp,
	},
	{
		name: 'Fire Capital',
		iconPath: FireCapitalStagePng,
		iconPathWebp: FireCapitalStageWebp,
	},
	{
		name: 'Hyperborean Harbor',
		iconPath: HyperboreanHarborStagePng,
		iconPathWebp: HyperboreanHarborStageWebp,
	},
	{
		name: 'Rock Wall',
		iconPath: RockWallStagePng,
		iconPathWebp: RockWallStageWebp,
	},
	{
		name: 'Tempest Peak',
		iconPath: TempestPeakStagePng,
		iconPathWebp: TempestPeakStageWebp,
	},
	{
		name: 'Forest Understory',
		iconPath: ForestUnderstoryStagePng,
		iconPathWebp: ForestUnderstoryStageWebp,
	},
	{
		name: 'Stormswept Pillar',
		iconPath: StormsweptPillarStagePng,
		iconPathWebp: StormsweptPillarStageWebp,
	},
]

/** List of all rival elements */
export const RIVAL_ELEMENTS: readonly RivalElement[] = ['Fire', 'Water', 'Air', 'Earth'] as const;

/** List of all rival names */
export const RIVAL_NAMES = RIVALS.map(rival => rival.name);

/** List of all stage names */
export const STAGE_NAMES = STAGES.map(stage => stage.name);
