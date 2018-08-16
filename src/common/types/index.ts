import { Store as ReduxStore } from "redux";

export * from "common/types/errors";
export * from "common/types/net";
export * from "common/types/tab-data";
import * as TabDataTypes from "common/types/tab-data";

import { TabData } from "common/types/tab-data";
import {
  GameUpdate,
  Game,
  User,
  Collection,
  CaveSummary,
  DownloadKeySummary,
  Download,
  DownloadProgress,
  Platform,
  Profile,
} from "common/butlerd/messages";
import { Endpoint } from "butlerd";
import { modals } from "common/modals";
export interface Store extends ReduxStore<RootState> {}

export interface Dispatch {
  (action: Action<any>): void;
}

export interface Action<T extends Object> {
  type: string;
  payload?: T;
}

interface Watcher {
  addSub(sub: Watcher): void;
  removeSub(sub: Watcher): void;
}

export interface ChromeStore extends Store {
  watcher: Watcher;
}

export interface Dispatch {
  (a: Action<any>): void;
}

export type GenerosityLevel = "discreet";

export type ClassificationAction = "launch" | "open";

export interface UserSet {
  [id: string]: User;
}

export interface GameSet {
  [id: string]: Game;
}

export interface CollectionSet {
  [id: string]: Collection;
}

/**
 * The entire application state, following the redux philosophy
 */
export interface RootState {
  system: SystemState;
  setup: SetupState;
  profile: ProfileState;
  winds: WindsState;
  i18n: I18nState;
  ui: UIState;
  preferences: PreferencesState;
  tasks: TasksState;
  downloads: DownloadsState;
  status: StatusState;
  gameUpdates: GameUpdatesState;

  /** commonly-needed subset of DB rows available in a compact & performance-friendly format */
  commons: CommonsState;

  systemTasks: SystemTasksState;
  broth: BrothState;
  butlerd: ButlerdState;
}

export interface BrothState {
  packageNames: string[];
  packages: PackagesState;
}

export interface PackagesState {
  [key: string]: PackageState;
}

export interface ButlerdState {
  startedAt: number;
  endpoint?: Endpoint;
}

export interface PackageState {
  stage: "assess" | "download" | "install" | "idle" | "need-restart";
  version?: string;
  versionPrefix?: string;
  progressInfo?: ProgressInfo;
  availableVersion?: string;
}

export interface CommonsState {
  downloadKeys: {
    [downloadKeyId: string]: DownloadKeySummary;
  };
  downloadKeyIdsByGameId: {
    [gameId: string]: string[];
  };

  caves: {
    [caveId: string]: CaveSummary;
  };
  caveIdsByGameId: {
    [gameId: string]: string[];
  };

  /** size on disk (in bytes) of each install location */
  locationSizes: {
    [id: string]: number;
  };
}

export interface GameUpdatesState {
  /** pending game updates */
  updates: {
    [caveId: string]: GameUpdate;
  };

  /** are we currently checking? */
  checking: boolean;

  /** check progress */
  progress: number;
}

export type ModalAction = Action<any> | Action<any>[];

export interface ModalButton {
  /** HTML id for this button */
  id?: string;

  /** icomoon icon to use for button */
  icon?: string;

  /** text to show on button */
  label: LocalizedString;

  /** what should happen when clicking the button */
  action?: ModalAction | "widgetResponse";

  /** use this to specify custom CSS classes (which is both naughty and nice) */
  className?: string;

  /** Tags to tack after label */
  tags?: ModalButtonTag[];

  timeAgo?: {
    date: Date;
  };
}

export interface ModalButtonTag {
  label?: LocalizedString;
  icon?: string;
}

// FIXME: that's naughty - just make static buttons be constants instead, that works.
export type ModalButtonSpec = ModalButton | "ok" | "cancel" | "nevermind";

export interface ModalBase {
  /** window this modal belongs to */
  wind: string;

  /** generated identifier for this modal */
  id?: string;

  /** title of the modal */
  title: LocalizedString;

  /** main body of text */
  message?: LocalizedString;

  /** secondary body of text */
  detail?: LocalizedString;

  /** an image to show prominently in the modal */
  stillCoverUrl?: string;
  coverUrl?: string;

  /** main buttons (in list format) */
  bigButtons?: ModalButtonSpec[];

  /** secondary buttons */
  buttons?: ModalButtonSpec[];

  unclosable?: boolean;
  fullscreen?: boolean;
}

export interface Modal extends ModalBase {
  /** name of modal widget to render */
  widget?: keyof typeof modals;

  /** parameters to pass to React component */
  widgetParams?: {};
}

export interface ModalUpdate {
  /** the modal's unique identifier */
  id: string;

  /** the parameters for the widget being shown in the modal */
  widgetParams: any;
}

export type ModalsState = Modal[];

export interface ItchAppTabs {
  /** id of current tab at time of snapshot */
  current: string;

  /** list of transient tabs when the snapshot was taken */
  items: TabDataTypes.TabDataSave[];
}

export type ProxySource = "os" | "env";

export interface ProxySettings {
  /** if non-null, the proxy specified by the OS (as sniffed by Chromium) */
  proxy?: string;

  /** if non-null, where the proxy settings come from */
  proxySource?: ProxySource;
}

export interface SystemState {
  /** app name, like 'itch' or 'kitch' */
  appName: string;

  /** version string, for example '25.0.0' */
  appVersion: string;

  /** the platform string, in itch format */
  platform: Platform;

  /** 'ia32' or 'x64' */
  arch: string;

  /** true if running on macOS */
  macos: boolean;

  /** true if running on Windows */
  windows: boolean;

  /** true if running on GNU/Linux */
  linux: boolean;

  /** 2-letter language code sniffed from user's OS */
  sniffedLanguage?: string;

  /** path of ~ */
  homePath: string;

  /** ~/.config/itch, ~/Library/Application Data/itch, %APPDATA%/itch */
  userDataPath: string;

  /** if non-null, the proxy specified by the OS (as sniffed by Chromium) */
  proxy?: string;

  /** if non-null, where the proxy settings come from */
  proxySource?: ProxySource;

  /** true if we're about to quit */
  quitting?: boolean;
}

export interface SystemTasksState {
  /** timestamp for next components update check (milliseconds since epoch) */
  nextComponentsUpdateCheck: number;

  /** timestamp for next game update check (milliseconds since epoch) */
  nextGameUpdateCheck: number;
}

export interface SetupOperation {
  message: LocalizedString;
  icon: string;
  stack?: string;
  stage?: string;
  progressInfo?: ProgressInfo;
}

export interface SetupState {
  done: boolean;
  errors: string[];
  blockingOperation: SetupOperation;
}

export interface ProfileState {
  /** collection freshness information */
  profile: Profile;
  login: ProfileLoginState;

  itchioUris: string[];
}

export interface WindsState {
  [wind: string]: WindState;
}

export interface WindState {
  navigation: NavigationState;
  modals: ModalsState;
  tabInstances: TabDataTypes.TabInstances;
  native: NativeWindowState;
  properties: WindPropertiesState;
}

export interface NativeWindowState {
  /** id of the electron BrowserWindow the window is displayed in */
  id: number;

  /** true if window has focus */
  focused: boolean;

  /** true if window is fullscreen */
  fullscreen: boolean;

  /** true if window is html-fullscreen */
  htmlFullscreen: boolean;

  /** true if window is maximized */
  maximized: boolean;
}

export interface ProfileLoginState {
  error?: Error;
  blockingOperation: SetupOperation;
  lastUsername?: string;
}

export type TabLayout = "grid" | "table";

export interface NavigationState {
  /** opened tabs */
  openTabs: string[];

  /** set to true when a tab is loading */
  loadingTabs: LoadingTabs;

  /** current tab id */
  tab: string;
}

export interface WindPropertiesState {
  /** what the window was opened on */
  initialURL: string;

  /** the window's role */
  role: WindRole;
}

export interface LoadingTabs {
  [key: string]: boolean;
}

export interface I18nResources {
  [lang: string]: I18nKeys;
}

export interface I18nKeys {
  [key: string]: string;
}

/** Info about a locale. See locales.json for a list that ships with the app. */
export interface LocaleInfo {
  /** 2-letter language code */
  value: string;

  /** native name of language (English, Français, etc.) */
  label: string;
}

export interface I18nState {
  /** 2-letter code for the language the app is currently displayed in */
  lang: string;

  /** all translated strings */
  strings: I18nResources;

  /** locales we'll download soon */
  queued: {
    [lang: string]: boolean;
  };

  /** locales we're downloading now */
  downloading: {
    [lang: string]: boolean;
  };

  locales: LocaleInfo[];
}

export interface UIMenuState {
  template: MenuTemplate;
}

export interface UIState {
  menu: UIMenuState;
  search: UISearchState;
}

export interface UISearchState {
  open: boolean;
}

interface InstallLocation {
  /** path on disk (empty for appdata) */
  path: string;

  /** set to true when deleted. still keeping the record around in case some caves still exist with it */
  deleted?: boolean;
}

export interface PreferencesState {
  /** is the app allowed to check for updates to itself? */
  downloadSelfUpdates: boolean;

  /** do not make any network requests */
  offlineMode: boolean;

  installLocations: {
    [key: string]: InstallLocation;
  };

  /** where to install games (doesn't change already-installed games) */
  defaultInstallLocation: string;

  /** use sandbox */
  isolateApps: boolean;

  /** when closing window, keep running in tray */
  closeToTray: boolean;

  /** notify when a download has been installed or updated */
  readyNotification: boolean;

  /** show the advanced section of settings */
  showAdvanced: boolean;

  /** language picked by the user */
  lang: string;

  /** if true, user's already seen the 'minimize to tray' notification */
  gotMinimizeNotification: boolean;

  /** should the itch app start on os startup? */
  openAtLogin: boolean;

  /** when the itch app starts at login, should it be hidden? */
  openAsHidden: boolean;

  /** show consent dialog before applying any game updates */
  manualGameUpdates: boolean;

  /** prevent display sleep while playing */
  preventDisplaySleep: boolean;

  /** if rediff'd patch is available, use it instead of original patch */
  preferOptimizedPatches: boolean;

  /** layout to use to show games */
  layout: TabLayout;

  /** disable all webviews */
  disableBrowser: boolean;

  /** disable GPU acceleration, see #809 */
  disableHardwareAcceleration: boolean;

  /** enable tabs - if false, use simple interface */
  enableTabs: boolean;

  /** the last version of the app we've successfully run a setup of, see https://github.com/itchio/itch/issues/1997 */
  lastSuccessfulSetupVersion: string;
}

export interface ITask {
  /** generated identifier */
  id: string;

  /** name of the task: install, uninstall, etc. */
  name: TaskName;

  /** progress in the [0, 1] interval */
  progress: number;

  /** id of the game this task is for (which game we're installing, etc.) */
  gameId: number;

  /** bytes per second at which task is being processed, if applicable */
  bps?: number;

  /** estimated time remaining for task, in seconds, if available */
  eta?: number;
}

export interface TasksState {
  /** all tasks currently going on in the app (installs, uninstalls, etc.) */
  tasks: {
    [key: string]: ITask;
  };

  /** same as tasks, grouped by gameId - there may be multiple for the same game */
  tasksByGameId: {
    [gameId: string]: ITask[];
  };

  /** all tasks finished and not cleared yet, since the app started */
  finishedTasks: ITask[];
}

export interface DownloadsState {
  /** All the downloads we know about, indexed by their own id */
  items: {
    [id: string]: Download;
  };

  /** IDs of all the downloads we know about, grouped by the id of the game they're associated to */
  itemIdsByGameId: {
    [gameId: string]: string[];
  };

  progresses: {
    [id: string]: DownloadProgress;
  };

  /** true if downloads are currently paused */
  paused: boolean;

  /** Download speeds, in bps, each item represents one second */
  speeds: number[];
}

type OpenAtLoginErrorCause = "no_desktop_file" | "error";

/**
 * Something went wrong when applying
 */
export interface IOpenAtLoginError {
  /** why did applying the setting failed */
  cause: OpenAtLoginErrorCause;

  /** if cause is `error`, this is an error message */
  message?: string;
}

export interface StatusState {
  messages: LocalizedString[];
  openAtLoginError: IOpenAtLoginError;
  reduxLoggingEnabled: boolean;
}

// i18n

/**
 * Localized messages can be just a string, or an Array arranged like so:
 * [key: string, params: {[name: string]: string}]
 */
export type LocalizedString = string | any[];

export interface ProgressInfo {
  /** progress of the task between [0,1] */
  progress: number;

  /** current bytes per second */
  bps?: number;

  /** estimated time remaining, in seconds */
  eta?: number;

  stage?: string;

  doneBytes?: number;
  totalBytes?: number;
}

export interface IProgressListener {
  (info: ProgressInfo): void;
}

export interface IRuntime {
  platform: Platform;
}

export interface MenuItem extends Electron.MenuItemConstructorOptions {
  localizedLabel?: LocalizedString;
  action?: Action<any>;
  submenu?: MenuItem[];
  id?: string;
}
export type MenuTemplate = MenuItem[];

export interface INavigatePayload {
  /** which window initiated the navigation */
  wind: string;

  /** the url to navigate to */
  url: string;

  /** if we know this associates with a resource, let it be known here */
  resource?: string;

  /** if we already have tab data, let it be here */
  data?: TabDataTypes.TabData;

  /** whether to open a new tab in the background */
  background?: boolean;

  /** whether to replace the current history entry */
  replace?: boolean;
}

export interface IOpenTabPayload extends INavigatePayload {
  wind: string;

  /** the id of the new tab to open (generated) */
  tab?: string;
}

export interface IOpenContextMenuBase {
  /** which window to open the context menu for */
  wind: string;

  /** left coordinate, in pixels */
  clientX: number;

  /** top coordinate, in pixels */
  clientY: number;
}

export interface ModalResponse {
  // FIXME: this is messy

  /** recaptcha challenge response */
  recaptchaResponse?: string;
}

interface IEvolveBasePayload {
  /** which window the tab belongs to */
  wind: string;

  /** the tab to evolve */
  tab: string;

  /** the new URL */
  url: string;

  /** the new resource if any */
  resource?: string;

  /** new tab data to add to the previous set */
  data?: TabData;
}

export interface IEvolveTabPayload extends IEvolveBasePayload {
  /** if false, that's a new history entry, if true it replaces the current one */
  replace: boolean;

  /** if true, will only set resource if the url is what we think it is */
  onlyIfMatchingURL?: boolean;

  fromWebContents?: boolean;
}

export interface INavigateTabPayload extends IEvolveBasePayload {
  /** whether to open in the background */
  background: boolean;
}

export type TaskName =
  | "install-queue"
  | "install"
  | "uninstall"
  | "configure"
  | "launch";

export type AutoUpdaterStart = () => Promise<boolean>;

export interface ExtendedWindow extends Window {
  windSpec: WindSpec;
}

export interface WindSpec {
  wind: string;
  role: WindRole;
}

export interface BrowserViewMetrics {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type WindRole = "main" | "secondary";

export interface SetBrowserScreenshot {
  tab: string;
  bitmap: Uint8Array;
  size: {
    width: number;
    height: number;
  };
}

export interface ClearBrowserScreenshot {
  tab: string;
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type Subtract<T, K> = Omit<T, keyof K>;
