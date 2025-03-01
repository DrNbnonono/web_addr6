const path = require('path');
const fs = require('fs');
const addr6Utils = require('../utils/addr6Utils');

const analyzeAddress = async (req, res) => {
    const {
        address,
        if_address,
        if_gen_addr,
        if_stdin,
        if_print_fixed,
        if_print_canonic,
        if_print_reverse,
        if_print_decode,
        if_print_stats,
        if_print_response,
        if_print_pattern,
        if_print_uni_preflen,
        if_block_dup,
        if_block_dup_preflen,
        if_accept,
        if_accept_type,
        if_accept_scope,
        if_accept_utype,
        if_accept_iid,
        if_block,
        if_block_type,
        if_block_scope,
        if_block_utype,
        if_block_iid,
        if_verbose,
        if_help,
        IID,
        prefix,
        prefix_len,
        type,
        range,
        result_txt,
        download,
    } = req.body;

    let filePath = '';
    if (req.file) {
        const userID = req.body.userID;
        const originalFileName = req.file.originalname;
        const newFileName = `${userID}-${originalFileName}`;
        filePath = `uploads/${newFileName}`;
        console.log('File path:', filePath);
        fs.rename(req.file.path, filePath, err => {
            if (err) {
                console.error('File rename error:', err);
            }
        });
    } else if (if_stdin) {
        filePath = '-';
    }

    try {
        const result = await addr6Utils.analyzeAddress({
            address,
            if_address,
            if_help,
            if_gen_addr,
            if_stdin,
            if_print_fixed,
            if_print_canonic,
            if_print_reverse,
            if_print_decode,
            if_print_stats,
            if_print_response,
            if_print_pattern,
            if_print_uni_preflen,
            if_block_dup,
            if_block_dup_preflen,
            if_accept,
            if_accept_type,
            if_accept_scope,
            if_accept_utype,
            if_accept_iid,
            if_block,
            if_block_type,
            if_block_scope,
            if_block_utype,
            if_block_iid,
            if_verbose,
            IID,
            prefix,
            prefix_len,
            type,
            range,
            filePath: filePath,
            result_txt: result_txt ? `result/${result_txt}.txt` : undefined,
        });

        if (result_txt) {
            const resultFilePath = path.join(__dirname, '../', `result/${result_txt}.txt`);
            fs.writeFileSync(resultFilePath, result, 'utf8');

            if (download) {
                // 确保文件已经完全写入磁盘
                fs.access(resultFilePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error('File not found:', err);
                        res.status(500).json({ error: "文件未找到" });
                    } else {
                        // 设置响应头，告诉浏览器这是一个文件下载
                        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(resultFilePath)}"`);
                        res.setHeader('Content-Type', 'application/octet-stream');
                        res.download(resultFilePath, (err) => {
                            if (err) {
                                console.error('File download error:', err);
                                res.status(500).json({ error: "文件下载失败" });
                            }
                        });
                    }
                });
            } else {
                res.json({ message: "文件已经成功接受，请耐心等待处理结果" });
            }
        } else {
            console.log('Result:', result);
            res.json({ result });
        }
    } catch (error) {
        if (error.includes('错误002')) {
            return res.status(400).json({ error: "错误002：文件大小超出限制，最大为50MB" });
        } else if (error.includes('错误003')) {
            return res.status(400).json({ error: "错误003：文件类型不支持，仅支持.txt文件" });
        } else {
            console.log('Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }
};

// 添加 downloadFile 方法
const downloadFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../', `result/${filename}`);

    // 检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File not found:', err);
            res.status(404).json({ error: "文件未找到" });
        } else {
            // 设置响应头，告诉浏览器这是一个文件下载
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.download(filePath, (err) => {
                if (err) {
                    console.error('File download error:', err);
                    res.status(500).json({ error: "文件下载失败" });
                }
            });
        }
    });
};

module.exports = {
    analyzeAddress,
    downloadFile
};
