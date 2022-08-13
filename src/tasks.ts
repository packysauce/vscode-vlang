import * as vscode from "vscode";

// Basically just a map to an invocation of V
export interface VTask extends vscode.TaskDefinition {
    /**
     * The V subcommand to use (blank for compile)
     */
    command: string;
    /**
     * The arguments to pass to the subcommand
     */
    args: string[];
    /**
     * The file or folder to compile
     */
    target: string;
}


function makeTask(task: string, args?: string[]): vscode.Task {
    return new vscode.Task(
        {
            type: "v",
            task,
            args,
        },
        vscode.TaskScope.Workspace,
        task,
        "V",
        new vscode.ShellExecution(`v ${task == "build" ? "" : task} ${args ?? ''} .`),
        "$gcc"
    );
}

export class VTaskProvider implements vscode.TaskProvider {
    public provideTasks(): vscode.Task[] {
        let build = makeTask("build");
        build.group = vscode.TaskGroup.Build;
        let run = makeTask("run");
        run.group = vscode.TaskGroup.Test;
        let test = makeTask("test");
        test.group = vscode.TaskGroup.Test;
        return [
            run,
            build,
            test,
        ];
    }

    public resolveTask(task): vscode.Task | undefined {
        if (task.definition.task) {
            const t: VTask = <any>task.definition;
            var new_task = makeTask(t.command, t.args);
            new_task.execution = new vscode.ShellExecution(`v ${t.command} ${t.args ?? ''} .`);
        }
        return undefined;
    }
}