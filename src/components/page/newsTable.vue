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
                            <el-form-item label="作者">
                                <span>{{ props.row.PublishPerson}}</span>
                            </el-form-item>
                            <el-form-item label="Guid ID">
                                <span>{{ props.row.Guid }}</span>
                            </el-form-item>
                            <el-form-item label="是否可用">
                                <span>{{ props.row.Enable }}</span>
                            </el-form-item>
                            <el-form-item label="发布时间">
                                <span>{{ props.row.PublishDate|TimeFormat }}</span>
                            </el-form-item>
                            <el-form-item label="内容分类">
                                <span>{{ props.row.Type|typeChange }}</span>
                            </el-form-item>
                            <el-form-item label="图片">
                                <img class="userPhoto" :src="`http://api.getcard.cn${props.row.Url}`">
                            </el-form-item>
                            <el-form-item label="内容" class="mystyle" style="display: block;width:100%">
                                <div>{{ props.row.Content }}</div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="PublishDate" label="创建日期" sortable width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.PublishDate|TimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="PublishPerson" label="作者" width="120">
                </el-table-column>
                <el-table-column prop="Title" label="文章标题">
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
        <el-dialog :title="form.Btn==1?'添加':'编辑'" :visible.sync="editVisible" width="60%" :before-close="beforeCloae">
            <el-form ref="form" :model="form" label-width="75px">
                <el-form-item label="文章标题">
                    <el-input v-model="form.Title"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="form.PublishPerson"></el-input>
                </el-form-item>
                <el-form-item label="文章类型">
                    <el-select v-model="value" placeholder="请选择" @change="changeType">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="banner图" v-if="showBanner">
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
                <el-form-item label="是否可用">
                    <el-switch v-model="form.Enable" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="新闻内容">
                    <div class="container">
                        <quill-editor ref="myTextEditor" v-model="form.Content" :options="editorOption"></quill-editor>
                    </div>
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
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import moment from 'moment';
export default {
    name: 'basetable',
    data() {
        return {

            //图片上传
            showImgUrl: false,
            showImg: true,
            fileList: [],
            disabledflag: false, //隐藏上传框
            dialogImageUrl: '',
            content: '',
            editorOption: {
                placeholder: 'Hello World'
            },
            totalNum: 0,
            tableData: [],
            cur_page: 0,
            multipleSelection: [],
            select_cate: '',
            select_word: '',
            del_list: [],
            is_search: false,
            editVisible: false,
            delVisible: false,
            options: [{
                value: 0,
                label: '攻略'
            }, {
                value: 1,
                label: '常见问题'
            }, {
                value: 2,
                label: '公告'
            }, {
                value: 3,
                label: 'banner'
            }, {
                value: 4,
                label: '发现'
            }, ],
            value: 0,
            form: {
                Guid: "",
                Title: '',
                PublishPerson: "",
                Content: "",
                Url: '',
                CreateTime: new Date(),
                Enable: true,
                Type: 0,
                Btn: '' //识别是点击添加还是编辑1=添加；2=编辑
            },
            idx: -1
        }
    },
    components: {
        quillEditor
    },
    created() {
        this.getUserList()
        console.log(this.form)
    },
    mounted() {

    },
    computed: {
        showBanner() {
            if (this.form.Type == 3) {
                return true
            } else {
                return false
            }
        },
    },
    filters: {
        TimeFormat(val) {
            let Time = moment(val).format('YYYY-MM-DD')
            return Time;
        },
        typeChange(val) {
            if (val == 0) {
                return "攻略"
            } else if (val == 1) {
                return "常见问题"
            } else if (val == 3) {
                return "公告"
            } else {
                return "banner"
            }
        }
    },
    methods: {
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
            this.dialogVisible1 = true;
            console.log("-----", file, this.dialogImageUrl)
        },
        onEditorChange({ editor, html, text }) {
            this.form.Content = html;
            console.log(this.content);
        },
        submit() {
            console.log(this.content);
            this.$message.success('提交成功！');
        },
        changeType(val) {
            this.form.Type = val;
            console.log(val)
        },
        //添加
        addBank() {
            this.form = {
                    Guid: '',
                    Title: '',
                    PublishPerson: '',
                    Content: '',
                    CreateTime: new Date(),
                    Enable: true,
                    Type: 0,
                    Url: '',
                    Btn: 1
                },
                this.editVisible = true;
        },
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val - 1;
            console.log(this.cur_page)
            this.getUserList();
        },
        //获取新闻列表
        getUserList() {
            let vm = this
            let value = {
                pageNo: this.cur_page,
                pageSize: 10
            }
            console.log(value)
            this.$axios.post(`${this.baseUrl}/api/Announcenment/GetAnnouncenmentList`, this.$qs.stringify(value))
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
                Title: this.select_word
            }
            this.$axios.post(`${this.baseUrl}/api/Announcenment/GetAnnouncenmentList`, this.$qs.stringify(value))
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
                Title: row.Title,
                PublishPerson: row.PublishPerson,
                Content: row.Content,
                CreateTime: new Date(),
                Enable: true,
                Url: row.Url,
                Type: row.Type ? row.Type : 0,
                Btn: 2 //识别是点击添加还是编辑1=添加；2=编辑
            }
            this.value = row.Type
            this.showImgUrl = true;
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
            if (this.form.Btn == 2) {
                delete this.form.Btn
                delete this.form.CreateTime
                this.$axios.post(`${this.baseUrl}/api/Announcenment/UpdateAnnoucenment`, this.$qs.stringify(this.form))
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
                this.$axios.post(`${this.baseUrl}/api/Announcenment/AddNewAnnouncenment`, this.$qs.stringify(this.form))
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
    .bankTable .demo-table-expand .mystyle {
        width: 100%;
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
