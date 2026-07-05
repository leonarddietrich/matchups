/**
 * Rivals of Aether 2 Constants
 */

// Import all character portraits
import AbsaPortrait from '@/assets/roa2/characters/RoA2_Absa_Portrait.png';
import ClairenPortrait from '@/assets/roa2/characters/RoA2_Clairen_Portrait.png';
import EtalusPortrait from '@/assets/roa2/characters/RoA2_Etalus_Portrait.png';
import FleetPortrait from '@/assets/roa2/characters/RoA2_Fleet_Portrait.png';
import ForsburnPortrait from '@/assets/roa2/characters/RoA2_Forsburn_Portrait.png';
import GalvanPortrait from '@/assets/roa2/characters/RoA2_Galvan_Portrait.png';
import KraggPortrait from '@/assets/roa2/characters/RoA2_Kragg_Portrait.png';
import LaReinaPortrait from '@/assets/roa2/characters/RoA2_La_Reina_Portrait.png';
import LoxodontPortrait from '@/assets/roa2/characters/RoA2_Loxodont_Portrait.png';
import MaypulPortrait from '@/assets/roa2/characters/RoA2_Maypul_Portrait.png';
import OlympiaPortrait from '@/assets/roa2/characters/RoA2_Olympia_Portrait.png';
import OrcanePortrait from '@/assets/roa2/characters/RoA2_Orcane_Portrait.png';
import RannoPortrait from '@/assets/roa2/characters/RoA2_Ranno_Portrait.png';
import SladePortrait from '@/assets/roa2/characters/RoA2_Slade_Portrait.png';
import WrastorPortrait from '@/assets/roa2/characters/RoA2_Wrastor_Portrait.png';
import ZetterburnPortrait from '@/assets/roa2/characters/RoA2_Zetterburn_Portrait.png';

// Import all stage images
// Stage PNG fallbacks
import AetherianForestStagePng from '@/assets/roa2/stages/AetherianForest.png';
import AirArmadaStagePng from '@/assets/roa2/stages/AirArmada.png';
import FireCapitalStagePng from '@/assets/roa2/stages/FireCapital.png';
import GodaiDeltaStagePng from '@/assets/roa2/stages/GodaiDelta.png';
import HodojoStagePng from '@/assets/roa2/stages/Hodojo.png';
import HyperboreanHarborStagePng from '@/assets/roa2/stages/HyperboreanHarbor.png';
import JulesvaleStagePng from '@/assets/roa2/stages/Julesvale.png';
import MerchantPortStagePng from '@/assets/roa2/stages/MerchantPort.png';
import RockWallStagePng from '@/assets/roa2/stages/RockWall.png';
import TempestPeakStagePng from '@/assets/roa2/stages/TempestPeak.png';

// Stage WEBP preferred assets
import AetherianForestStageWebp from '@/assets/roa2/stages/AetherianForest.webp';
import AirArmadaStageWebp from '@/assets/roa2/stages/AirArmada.webp';
import FireCapitalStageWebp from '@/assets/roa2/stages/FireCapital.webp';
import GodaiDeltaStageWebp from '@/assets/roa2/stages/GodaiDelta.webp';
import HodojoStageWebp from '@/assets/roa2/stages/Hodojo.webp';
import HyperboreanHarborStageWebp from '@/assets/roa2/stages/HyperboreanHarbor.webp';
import JulesvaleStageWebp from '@/assets/roa2/stages/Julesvale.webp';
import MerchantPortStageWebp from '@/assets/roa2/stages/MerchantPort.webp';
import RockWallStageWebp from '@/assets/roa2/stages/RockWall.webp';
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
		color: '#333344',
	},
	{
		name: 'Loxodont',
		element: 'Fire',
		iconPath: LoxodontPortrait,
		color: '#444444',
	},
	{
		name: 'Clairen',
		element: 'Fire',
		iconPath: ClairenPortrait,
		color: '#990044',
	},
	{
		name: 'Zetterburn',
		element: 'Fire',
		iconPath: ZetterburnPortrait,
		color: '#FFAA00',
	},
	{
		name: 'La Reina',
		element: 'Fire',
		iconPath: LaReinaPortrait,
		color: '#993355',
	},
	{
		name: 'Galvan',
		element: 'Earth',
		iconPath: GalvanPortrait,
		color: '#224444',
	},
	{
		name: 'Olympia',
		element: 'Earth',
		iconPath: OlympiaPortrait,
		color: '#AA9999',
	},
	{
		name: 'Maypul',
		element: 'Earth',
		iconPath: MaypulPortrait,
		color: '#335522',
	},
	{
		name: 'Kragg',
		element: 'Earth',
		iconPath: KraggPortrait,
		color: '#663322',
	},
	{
		name: 'Wrastor',
		element: 'Air',
		iconPath: WrastorPortrait,
		color: '#331144',
	},
	{
		name: 'Fleet',
		element: 'Air',
		iconPath: FleetPortrait,
		color: '#CC6644',
	},
	{
		name: 'Absa',
		element: 'Air',
		iconPath: AbsaPortrait,
		color: '#444477',
	},
	{
		name: 'Ranno',
		element: 'Water',
		iconPath: RannoPortrait,
		color: '#66CC33',
	},
	{
		name: 'Orcane',
		element: 'Water',
		iconPath: OrcanePortrait,
		color: '#334499',
	},
	{
		name: 'Etalus',
		element: 'Water',
		iconPath: EtalusPortrait,
		color: '#EEFFFF',
	},
	{
		name: 'Slade',
		element: 'Water',
		iconPath: SladePortrait,
		color: '#334477',
	}
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
		name: 'Air Armada',
		iconPath: AirArmadaStagePng,
		iconPathWebp: AirArmadaStageWebp,
	},	{
		name: 'Merchant Port',
		iconPath: MerchantPortStagePng,
		iconPathWebp: MerchantPortStageWebp,
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
	}
]

/** List of all rival elements */
export const RIVAL_ELEMENTS: readonly {name: RivalElement, color: string}[] = [
	{ name:'Fire',
		color: '#C43445'
	},
	{
		name: 'Air',
		color: '#C88DCD'
	},
	{
		name: 'Earth',
		color: '#64A95E'
	},
	{
		name: 'Water',
		color: '#6179CD'
	},
] as const;

/** List of all rival names */
export const RIVAL_NAMES = RIVALS.map(rival => rival.name);

/** List of all stage names */
export const STAGE_NAMES = STAGES.map(stage => stage.name);
