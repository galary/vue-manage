<template>
    <div class="bankTable">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" v-if="false" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" @click="addBank('add')">添加</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <!-- <el-table-column type="selection" width="55" style="display: none"></el-table-column> -->
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="银行名称">
                                <span>{{ props.row.Name}}</span>
                            </el-form-item>
                            <el-form-item label="Guid ID">
                                <span>{{ props.row.Guid }}</span>
                            </el-form-item>
                            <el-form-item label="Enable">
                                <span>{{ props.row.Enable }}</span>
                            </el-form-item>
                            <el-form-item label="Recommend">
                                <span>{{ props.row.Recommend }}</span>
                            </el-form-item>
                            <el-form-item label="手机号码">
                                <span>{{ props.row.Tel }}</span>
                            </el-form-item>
                            <el-form-item label="银行描述">
                                <span>{{ props.row.Description }}</span>
                            </el-form-item>
                            <el-form-item label="银行图标">
                                <img class="userPhoto" :src="`http://api.getcard.cn${props.row.Url}`">
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="CreateTime" label="创建日期" sortable width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.CreateTime|TimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Name" label="银行名称" width="120">
                </el-table-column>
                <el-table-column prop="Tel" label="银行电话号码">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="total,prev, pager, next" :total="totalNum">
                </el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%" :before-close="beforeCloae">
            <el-dialog title="上传银行图标" :append-to-body='true' :visible.sync="upimgVisible" width="300px" center>
                <span slot="footer" class="dialog-footer">
                <el-button @click="upimgVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadFiles">确 定</el-button>
            </span>
            </el-dialog>
            <el-form ref="form" :model="form" label-width="75px">
                <el-form-item label="银行名称">
                    <el-input v-model="form.Name"></el-input>
                </el-form-item>
                <el-form-item label="银行电话">
                    <el-input v-model="form.Tel"></el-input>
                </el-form-item>
                <el-form-item label="银行描述">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.Description">
                    </el-input>
                </el-form-item>
                <el-form-item label="银行图标">
                    <div v-if="form.Btn=='1'">
                        <div v-if="showImg">
                            <el-upload :file-list="fileList" :class="{disabled:disabledflag}" ref='upload' action="" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :auto-upload='false' :multiple='false' :limit="1" :http-request="uploadFiles" accept="image/jpeg,image/gif,image/png" :on-change='changeUpload'>
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-button size="mini" @click="uploadFiles" type="primary">上传银行图标</el-button>
                        </div>
                        <el-input type="text" :disabled="true" placeholder='上传银行图标' v-model="form.Url" v-if="showImgUrl">
                        </el-input>
                    </div>
                    <div v-if="form.Btn=='2'">
                        <div v-if="showImg">
                            <el-upload :file-list="fileList" :class="{disabled:disabledflag}" ref='upload' action="" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :auto-upload='false' :multiple='false' :limit="1" :http-request="uploadFiles" accept="image/jpeg,image/gif,image/png" :on-change='changeUpload'>
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-button size="mini" @click="uploadFiles" type="primary">上传银行图标</el-button>
                        </div>
                        <el-input type="text" :disabled="true" placeholder='上传银行图标' v-model="form.Url" v-if="showImgUrl">
                        </el-input>
                    </div>
                </el-form-item>
                <!--       <el-form-item label="银行图标">
                    <el-upload ref='upload' :auto-upload='false' id='innerupImg' :file-list="fileList" :multiple='false' :limit="1" :on-exceed="handleExceed" :http-request="uploadFiles" accept="image/jpeg,image/gif,image/png" action='' :on-change='changeUpload'>
                        <el-button slot="trigger" size="mini" type="primary">选取图片</el-button>
                    </el-upload>
                    <el-button size="mini" @click="uploadFiles" type="primary">上传银行图标</el-button>
                </el-form-item> -->
                <el-form-item label="推荐">
                    <el-switch v-model="form.Recommend" @change="changeRecommend" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="Enable">
                    <el-switch v-model="form.Enable" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
console.log(this)
// layui.use('upload', function() {})

</script>
<script>
import vuetable from '../../../static/vuetable.json'
// import layer from 'vue-layer'
import moment from 'moment';
export default {
    name: 'basetable',
    data() {
        return {
            showImgUrl: false,
            showImg: true,

            //111
            dialogImageUrl: '',
            upimgVisible: false,
            totalNum: 0,
            url: './static/vuetable.json',
            tableData: [],
            fileList: [],
            uploadImgUrl: `${this.baseUrl}/api/UploadImgs/UploadBank`,
            cur_page: 0,
            multipleSelection: [],
            select_cate: '',
            select_word: '',
            del_list: [],
            is_search: false,
            editVisible: false,
            delVisible: false,
            Recommend: true,
            deleteBankId: '',
            disabledflag: false, //隐藏上传框
            form: {
                Guid: "",
                Name: "",
                Description: "",
                Url: '',
                Tel: "",
                CreateTime: new Date(),
                Recommend: true,
                Enable: true,
                Url: "",
                Btn: '1' //识别是点击添加还是编辑1=添加；2=编辑
            },
            uploadUrl: `${this.baseUrl}/api/UploadImgs/UploadBank`,
            idx: -1
        }
    },
    created() {
        this.getUserList()
        console.log(this.form)
    },
    mounted() {

    },
    filters: {
        TimeFormat(val) {
            let Time = moment(val).format('YYYY-MM-DD')
            return Time;
        }
    },
    methods: {
        handleRemove(file, fileList) {
            if (fileList.length == 0) {
                this.disabledflag = false;
            }
        },
        beforeCloae() {
            this.showImg = true;
            this.showImgUrl = false;
            this.editVisible = false;
            this.dialogImageUrl = '';
        },
        handlePictureCardPreview(file) {
            console.log()
            this.dialogImageUrl = file.url;
            console.log("-----", file, this.dialogImageUrl)
        },
        changeRecommend() {

        },
        showUpimg() {

        },
        //上传图片
        uploadFiles() {
            var that = this;
            let file = this.$refs.upload.$refs['upload-inner'].$refs.input; //获取文件数据
            let fileList = file.files;
            console.log(fileList)
            var imgFile;
            let reader = new FileReader(); //html5读文件
            reader.readAsDataURL(fileList[0]); //转BASE64   
            reader.onload = function(e) { //读取完毕后调用接口
                imgFile = e.target.result;
                let obj = {
                    Type: "2",
                    dataURL: imgFile
                }
                that.$axios.post(`${that.baseUrl}/api/UploadImgs/UploadImageByBase64String`, that.$qs.stringify(obj)).then((res) => {
                    if (res.data.Success == true) {
                        if (that.form.Btn == "1") {
                            that.showImg = false;
                            that.showImgUrl = true;
                            that.form.Url = res.data.Data;
                        } else {
                            that.showImg = false;
                            that.showImgUrl = true;
                            that.form.Url = res.data.Data;
                        }

                        console.log(res.data)
                    } else {
                        this.$message.error('图片上传失败', res);
                        return ''
                    }
                })

            };
        },
        changeUpload(file, fileList) {
            if (fileList.length > 0) {
                this.disabledflag = true
                this.disabledflag1 = false
            } else {
                this.disabledflag = false;

            }
            console.log(fileList.length)
            // if (fileList.length = 0) {
            //     this.disabledflag = false
            // }
        },
        //添加
        addBank() {
            this.form = {
                Guid: "",
                Name: "",
                Description: "",
                Tel: "",
                Url: '',
                CreateTime: new Date(),
                Recommend: false,
                Enable: false,
                Url: "",
                Btn: '1'
            }
            this.editVisible = true;
            this.dialogImageUrl = ''
        },
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val - 1;
            console.log(this.cur_page)
            this.getUserList();
        },
        //获取用户列表
        getUserList() {
            let vm = this
            let value = {
                pageNo: this.cur_page,
                pageSize: 10
            }
            console.log(value)
            this.$axios.post(`${this.baseUrl}/api/Bank/GetBankListForAdmin`, this.$qs.stringify(value))
                .then((res) => {
                    console.log(res.data)
                    this.tableData = res.data.Data;
                    this.totalNum = res.data.totalCount
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        search() {
            let vm = this
            let value = {
                pageNo: this.cur_page,
                pageSize: 10,
                Name: this.select_word
            }
            this.$axios.post(`${this.baseUrl}/api/Bank/GetBankListForAdmin`, this.$qs.stringify(value))
                .then((res) => {
                    console.log(res.data)
                    this.tableData = res.data.Data;
                    this.totalNum = res.data.totalCount
                })
                .catch(function(error) {
                    console.log(error);
                });
            this.is_search = true;
        },
        handleEdit(index, row) {
            this.idx = index;
            this.form = {
                Guid: row.Guid,
                Name: row.Name,
                Description: row.Description,
                Tel: row.Tel,
                Url: row.Url,
                CreateTime: new Date(),
                Recommend: row.Recommend,
                Enable: row.Enable,
                Url: row.Url,
                Btn: '2'
            }
            this.showImgUrl = true;
            this.dialogImageUrl = '';
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.deleteBankId = row.Guid
            this.delVisible = true;
        },
        delAll() {
            const length = this.multipleSelection.length;
            let str = '';
            this.del_list = this.del_list.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error('删除了' + str);
            this.multipleSelection = [];
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 保存编辑
        saveEdit() {
            console.log(this.form)
            if (this.form.Btn == '2') {
                this.$axios.post(`${this.baseUrl}/api/Bank/UpdateBank`, this.$qs.stringify(this.form))
                    .then((res) => {
                        if (res.data.Success == true) {
                            console.log(res.data)
                            this.$message.success(res.data.message);
                        } else {
                            this.$message.success('更新失败');
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            } else {
                delete this.form.Btn
                delete this.form.Guid
                this.$axios.post(`${this.baseUrl}/api/Bank/AddBank`, this.$qs.stringify(this.form))
                    .then((res) => {
                        if (res.data.Success == true) {
                            console.log(res.data)
                            this.$message.success(res.data.message);
                        } else {
                            this.$message.success('添加失败');
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
            this.editVisible = false
            this.getUserList()
        },
        // 确定删除
        deleteRow() {
            this.$axios.post(`${this.baseUrl}/api/Bank/DeleteBank?bankId=${this.deleteBankId}`)
                .then((res) => {
                    if (res.data.Success == true) {
                        console.log(res.data)
                        this.$message.success(res.data.message);
                        this.getUserList()
                    } else {
                        this.$message.success('删除失败');
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
            this.delVisible = false;
            this.getUserList()
        }
    }
}

</script>
<style lang="less">
#innerupImg {
    .el-upload--text {
        width: 250px;
    }
}
.bankTable {

    .disabled .el-upload--picture-card {
        display: none;
    }
    .el-dialog {
        .el-dialog__header {
            padding: 10px 20px 10px;
        }
        .el-dialog__body {
            padding: 0 20px;
            .el-form-item {
                margin-bottom: 20px;
            }
        }
    }
    .handle-box {
        margin-bottom: 20px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .handle-select {
        width: 120px;
    }
    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .userPhoto {
        width: 40px;
        height: 40px;
    }
    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }
}

</style>
