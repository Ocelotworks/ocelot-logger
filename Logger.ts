import dateFormat from "dateformat";
// @ts-ignore
import colors from "colors";
import caller_id from "caller-id";
import * as path from "path";
import * as console from "console";


export enum LogLevel {
    INFO,
    LOG,
    WARN,
    ERROR
}

export enum LogColours {
    YELLOW = '\u001b[33;1m',
    RESET = '\u001b[0m',
    RED = '\u001b[31m',
    BOLD = '\u001b[1m',
    GREY = '\u001b[90m',
    GRAY = GREY
}

export default class Logger {


    prefixFormat: (date: Date, caller: any, level: LogLevel) => string;
    suffixFormat: (date: Date, caller: any, level: LogLevel) => string;
    level: LogLevel = LogLevel.INFO;

    setPrefixFormat(func: (date: Date, caller: any, level: LogLevel) => any){
        this.prefixFormat = func;
    }

    setSuffixFormat(func: (date: Date, caller: any, level: LogLevel) => any){
        this.prefixFormat = func;
    }

    constructor(){
        this.setPrefixFormat(function(date: Date, caller: any, level: LogLevel){
            let file = ["Nowhere"];
            if(caller.filePath)
                file = caller.filePath.split(path.sep);
            let prefix = `${LogColours.BOLD}[${dateFormat(date, "dd/mm/yy hh:MM")}][${file[file.length-1]}${caller.functionName ? "/"+caller.functionName : ""}]${LogColours.RESET}`;
            switch(level){
                case LogLevel.ERROR:
                    prefix += LogColours.RED;
                    break;
                case LogLevel.WARN:
                    prefix += LogColours.YELLOW;
                    break;
                case LogLevel.INFO:
                    prefix += LogColours.GREY;
                    break;
            }
            return prefix;
        });

        this.setSuffixFormat(function(){
            return "";
        })
    }

    log(...message: any){
        const caller = caller_id.getData();
        this.printMessage(message, caller)
    }

    error(...message: any){
        const caller = caller_id.getData();
        this.printMessage(message, caller, LogLevel.ERROR)
    }

    warn(...message: any){
        const caller = caller_id.getData();
        this.printMessage(message, caller, LogLevel.WARN)
    }

    info(...message: any){
        const caller = caller_id.getData();
        this.printMessage(message, caller, LogLevel.INFO)
    }

    protected printMessage(message: any[], caller, level: LogLevel = LogLevel.LOG){
        if(level < this.level)return;
        const now = new Date();
        const prefix = this.prefixFormat(now, caller, level);
        const suffix = this.suffixFormat(now, caller, level) + LogColours.RESET;
        console.log(prefix, ...message, suffix);
    }
}