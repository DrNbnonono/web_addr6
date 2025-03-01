const { exec } = require('child_process');

const analyzeAddress = (options) => {
    return new Promise((resolve, reject) => {
        let command = 'addr6'; // 基础命令

        // 根据传入的参数动态构建命令
        //输入格式的选择
        if (options.if_address) {
            command += ` -a ${options.address}`;
        }
        if (options.address){
            command += ` -a ${options.address}`;
        }
        if (options.if_gen_addr) {
            command += ` -A ${options.prefix}`;
        }
        //输入文件选项
        if (options.filePath) {
            command = `cat ${options.filePath} | addr6 -i`;
        }
        //输出格式选项
        if (options.if_print_fixed) {
            command += ' -f';
        }
        if (options.if_print_canonic) {
            command += ' -c';
        }
        if (options.if_print_reverse) {
            command += ' -r';
        }
        if (options.if_print_decode) {
            command += ' -d';
        }
        if (options.if_print_stats) {
            command += ' -s';
        }
        if (options.if_print_response) {
            command += ' -R';
        }
        if (options.if_print_pattern) {
            command += ' -x';
        }
        if (options.if_print_uni_preflen) {
            command += ' -P';
        }
        //过滤选项
        if (options.if_block_dup) {
            command += ' -q';
        }
        if (options.if_block_dup_preflen) {
            command += ` -p ${options.prefix_len}` ;
        }
        if (options.if_accept) {
            command += ` -j ${options.prefix}`;
        }
        if (options.if_accept_type) {
            command += ` -b ${options.type}`;
        }
        if (options.if_accept_scope) {
            command += ` -k ${options.range}`;
        }
        if (options.if_accept_utype) {
            command += ` -w ${options.type}`;
        }
        if (options.if_accept_iid) {
            command += ` -g ${options.IID}`;
        }
        if (options.if_block) {
            command += ` -J ${options.prefix}`;
        }
        if (options.if_block_type) {
            command += ` -B ${options.type}`;
        }
        if (options.if_block_scope) {
            command += ` -K ${options.range}`;
        }
        if (options.if_block_utype) {
            command += ` -W ${options.type}`;
        }
        if (options.if_block_iid) {
            command += ` -G ${options.IID}`;
        }
        //其他选项
        if (options.if_verbose) {
            command += ' -v';
        }
        if (options.if_help) {
            command += ' -h';
        }

        if (options.result_txt){
            command += ` > ${options.result_txt}`;
        }

        // 执行命令
        console.log("Command being executed", command);
        const child = exec(command, { maxBuffer: 1024 * 1024 * 10 });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data;
        });

        child.stderr.on('data', (data) => {
            stderr += data;
        });

        child.on('close', (code) => {
            if (stderr) {
                // 如果有 stderr 输出，返回错误
                reject(stderr);
            } else {
                // 无论退出码如何，都返回 stdout 内容
                resolve(stdout);
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
};

module.exports = {
    analyzeAddress
};
