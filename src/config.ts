import * as vscode from 'vscode';
import { customREPLCommandSnippet } from './evaluate';
import { ReplConnectSequence } from './nrepl/connectSequence';
import { PrettyPrintingOptions } from './printer';
import { parseEdn } from '../out/cljs-lib/cljs-lib';
import * as state from './state';

const REPL_FILE_EXT = 'calva-repl';
const KEYBINDINGS_ENABLED_CONFIG_KEY = 'calva.keybindingsEnabled';
const KEYBINDINGS_ENABLED_CONTEXT_KEY = 'calva:keybindingsEnabled';

type ReplSessionType = 'clj' | 'cljs';

// include the 'file' and 'untitled' to the
// document selector. All other schemes are
// not known and therefore not supported.
const documentSelector = [
    { scheme: 'file', language: 'clojure' },
    { scheme: 'jar', language: 'clojure' },
    { scheme: 'untitled', language: 'clojure' },
];

/**
 * Trims EDN alias and profile names from any surrounding whitespace or `:` characters.
 * This in order to free the user from having to figure out how the name should be entered.
 * @param  {string} name
 * @return {string} The trimmed name
 */
function _trimAliasName(name: string): string {
    return name.replace(/^[\s,:]*/, '').replace(/[\s,:]*$/, '');
}

async function readEdnWorkspaceConfig(uri?: vscode.Uri) {
    try {
        const data = await vscode.workspace.fs.readFile(
            uri ?? vscode.Uri.file(state.resolvePath('.calva/config.edn'))
        );
        return addEdnConfig(new TextDecoder('utf-8').decode(data));
    } catch (error) {
        return error;
    }
}

/**
 * Saves the EDN config in the state to be merged into the actual vsconfig.
 * Currently only `:customREPLCommandSnippets` is supported and the `:snippet` has to be a string.
 * @param {string} data a string representation of a clojure map
 * @returns an error of one was thrown
 */
async function addEdnConfig(data: string) {
    try {
        const parsed = parseEdn(data);
        const old = state.getProjectConfig();
        if (old && old.customREPLCommandSnippets) {
            state.setProjectConfig({
                customREPLCommandSnippets: old.customREPLCommandSnippets.concat(
                    parsed?.customREPLCommandSnippets ?? []
                ),
            });
        } else {
            state.setProjectConfig({
                customREPLCommandSnippets:
                    parsed?.customREPLCommandSnippets ?? [],
            });
        }
    } catch (error) {
        return error;
    }
}
const watcher = vscode.workspace.createFileSystemWatcher(
    '**/.calva/**/config.edn',
    false,
    false,
    false
);

watcher.onDidChange((uri: vscode.Uri) => {
    readEdnWorkspaceConfig(uri);
});

// TODO find a way to validate the configs
function getConfig() {
    const configOptions = vscode.workspace.getConfiguration('calva');
    const pareditOptions = vscode.workspace.getConfiguration('calva.paredit');

    const w =
        (configOptions.inspect('customREPLCommandSnippets')
            .workspaceValue as customREPLCommandSnippet[]) ?? [];
    const commands = w.concat(
        (state.getProjectConfig()
            ?.customREPLCommandSnippets as customREPLCommandSnippet[]) ?? []
    );

    return {
        format: configOptions.get('formatOnSave'),
        evaluate: configOptions.get('evalOnSave'),
        test: configOptions.get('testOnSave'),
        showDocstringInParameterHelp: configOptions.get<boolean>(
            'showDocstringInParameterHelp'
        ),
        jackInEnv: configOptions.get('jackInEnv'),
        jackInDependencyVersions: configOptions.get<{
            JackInDependency: string;
        }>('jackInDependencyVersions'),
        clojureLspVersion: configOptions.get<string>('clojureLspVersion'),
        clojureLspPath: configOptions.get<string>('clojureLspPath'),
        openBrowserWhenFigwheelStarted: configOptions.get<boolean>(
            'openBrowserWhenFigwheelStarted'
        ),
        customCljsRepl: configOptions.get('customCljsRepl', null),
        replConnectSequences: configOptions.get<ReplConnectSequence[]>(
            'replConnectSequences'
        ),
        myLeinProfiles: configOptions
            .get<string[]>('myLeinProfiles', [])
            .map(_trimAliasName),
        myCljAliases: configOptions
            .get<string[]>('myCljAliases', [])
            .map(_trimAliasName),
        asyncOutputDestination: configOptions.get<string>('sendAsyncOutputTo'),
        customREPLCommandSnippets: configOptions.get(
            'customREPLCommandSnippets',
            []
        ),
        customREPLCommandSnippetsGlobal: configOptions.inspect(
            'customREPLCommandSnippets'
        ).globalValue as customREPLCommandSnippet[],
        customREPLCommandSnippetsWorkspace: commands,
        customREPLCommandSnippetsWorkspaceFolder: configOptions.inspect(
            'customREPLCommandSnippets'
        ).workspaceFolderValue as customREPLCommandSnippet[],
        prettyPrintingOptions: configOptions.get<PrettyPrintingOptions>(
            'prettyPrintingOptions'
        ),
        evaluationSendCodeToOutputWindow: configOptions.get<boolean>(
            'evaluationSendCodeToOutputWindow'
        ),
        enableJSCompletions: configOptions.get<boolean>('enableJSCompletions'),
        autoOpenREPLWindow: configOptions.get<boolean>('autoOpenREPLWindow'),
        autoOpenJackInTerminal: configOptions.get('autoOpenJackInTerminal'),
        referencesCodeLensEnabled: configOptions.get<boolean>(
            'referencesCodeLens.enabled'
        ),
        hideReplUi: configOptions.get<boolean>('hideReplUi'),
        strictPreventUnmatchedClosingBracket: pareditOptions.get<boolean>(
            'strictPreventUnmatchedClosingBracket'
        ),
        showCalvaSaysOnStart: configOptions.get<boolean>(
            'showCalvaSaysOnStart'
        ),
        jackIn: {
            useDeprecatedAliasFlag: configOptions.get<boolean>(
                'jackIn.useDeprecatedAliasFlag'
            ),
        },
    };
}

export {
    readEdnWorkspaceConfig,
    addEdnConfig,
    REPL_FILE_EXT,
    KEYBINDINGS_ENABLED_CONFIG_KEY,
    KEYBINDINGS_ENABLED_CONTEXT_KEY,
    documentSelector,
    ReplSessionType,
    getConfig,
};
