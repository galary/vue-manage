<template>
    <div class="table cardsTable">
        <div class="container">
            <div class="handle-box">
                <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button> -->
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" @click="addBank">添加</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="信用卡名">
                                <span>{{ props.row.Name}}</span>
                            </el-form-item>
                            <el-form-item label="卡类型">
                                <span>{{ props.row.Level }}</span>
                            </el-form-item>
                            <el-form-item label="卡种">
                                <span>{{ props.row.Type }}</span>
                            </el-form-item>
                            <el-form-item label="是否推荐">
                                <span>{{ props.row.Recommend }}</span>
                            </el-form-item>
                            <el-form-item label="是否可用">
                                <span>{{ props.row.Enable }}</span>
                            </el-form-item>
                            <el-form-item label="发行时间">
                                <span>{{ props.row.PublishDate|TimeFormat}}</span>
                            </el-form-item>
                            <el-form-item label="图1">
                                <img :src="props.row.Attachments.length>0?'http://api.getcard.cn'+props.row.Attachments[0].Url:''" alt="">
                            </el-form-item>
                            <el-form-item label="图2" v-if="props.row.Attachments.length>1">
                                <img :src="props.row.Attachments.length>1?'http://api.getcard.cn'+props.row.Attachments[1].Url:''" alt="">
                            </el-form-item>
                            <el-form-item label="申请地址">
                                <div>{{ props.row.ApplyAddress }}</div>
                            </el-form-item>
                            <el-form-item label="描述" style="display: block;">
                                <div>{{ props.row.Description }}</div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="CreateTime" label="创建日期" sortable width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.CreateTime|TimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="Level" label="卡类型">
                </el-table-column>
                <el-table-column prop="Quota" label="优惠">
                </el-table-column>
                <el-table-column prop="RightsInterests" label="额度">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%" @close="closeDialog">
            <el-form ref="form" :model="form" label-width="75px">
                <el-form-item label="信用卡名">
                    <el-input v-model="form.Name"></el-input>
                </el-form-item>
                <el-form-item label="卡类型">
                    <el-input v-model="form.Level"></el-input>
                </el-form-item>
                <el-form-item label="卡种类">
                    <el-input v-model="form.Type"></el-input>
                </el-form-item>
                <el-form-item label="所属银行">
                    <el-select v-model="bankValue" placeholder="请选择" @change="getBankID">
                        <el-option v-for="item in options" :key="item.id" :label="item.Name" :value="item.id" v-if="item.Name==null?false:true">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发行时间">
                    <el-date-picker @change="timeChange" v-model="form.PublishDate" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="优惠">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.Quota">
                    </el-input>
                </el-form-item>
                <el-form-item label="额度">
                    <el-input placeholder="请输入额度" v-model="form.RightsInterests">
                    </el-input>
                </el-form-item>
                <el-form-item label="申请网址">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.ApplyAddress">
                    </el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.Description">
                    </el-input>
                </el-form-item>
                <el-form-item label="上传图片">
                    <el-upload class="upload-demo" :action='`${this.baseUrl}/api/UploadImgs/UploadImageByBase64String`' :on-preview="handlePreview" :on-success="handleSuccess" :before-remove="beforeRemove" multiple :limit="2" :on-exceed="handleExceed" :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="推荐">
                    <el-switch v-model="form.Recommend" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="是否可用">
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
import vuetable from '../../../static/vuetable.json'
import moment from 'moment';
export default {
    name: 'basetable',
    data() {
        return {
            totalNum: 0,
            url: './static/vuetable.json',
            tableData: [],
            page: {},
            cur_page: 0,
            multipleSelection: [],
            select_cate: '',
            select_word: '',
            del_list: [],
            is_search: false,
            editVisible: false,
            delVisible: false,
            BankId: "",
            Type: "",
            Level: "",
            Para: "",
            options: [],
            bankValue: "",
            fileList: [],
            form: {
                Guid: "",
                BankId: "",
                Name: "",
                Level: "",
                bankId: '',
                ApplyAddress: "",
                Type: "",
                Description: "",
                Quota: "",
                Recommend: true,
                RightsInterests: "",
                PublishDate: new Date(),
                CreateTime: new Date(),
                Sorting: 0,
                Enable: true,
                Btn: '' //识别是点击添加还是编辑1=添加；2=编辑
            },
            idx: -1
        }
    },
    created() {
        console.log(vuetable)
        // this.getData();

        this.getUserList()
    },
    mounted() {
        this.getBankList()
        let Nowdata = new Date()
        console.log(Nowdata, this.form.CreateTime)
    },
    filters: {
        TimeFormat(val) {
            let Time = moment(val).format('YYYY-MM-DD')
            return Time;
        }
    },
    methods: {
        getBankID(val) {
            this.form.BankId = val;
            console.log(this.form.bankId, val)
        },
        closeDialog() {
            this.bankValue = ""
        },
        timeChange(val) {
            console.log(val)
        },
        handleSuccess(res, file, fileList) {
            console.log(res, file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        //添加
        addBank() {
            this.form = {
                    Guid: "",
                    BankId: "",
                    Name: "",
                    Level: "",
                    ApplyAddress: "",
                    Type: "",
                    Description: "",
                    Quota: "",
                    bankId: '',
                    Recommend: false,
                    RightsInterests: "",
                    PublishDate: new Date(),
                    // CreateTime: new Date(),
                    Sorting: 0,
                    Enable: false,
                    Btn: '1'
                },
                this.editVisible = true;
        },
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val - 1;
            this.getUserList();
        },
        //获取用户列表
        getUserList() {
            let vm = this
            let value = {
                pageNo: this.cur_page,
                pageSize: 10,
                BankId: this.BankId,
                Type: this.Type,
                Level: this.Level,
                Para: this.Para
            }
            console.log(value)
            this.$axios.post(`${this.baseUrl}/api/CreditCard/GetCreditCardByBankId`, this.$qs.stringify(value))
                .then((res) => {
                    this.tableData = res.data.Data;
                    this.totalNum = res.data.totalCount
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        // 获取 easy-mock 的模拟数据
        getData() {

            // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
            // if (process.env.NODE_ENV === 'development') {
            //     this.url = '/ms/table/list';
            // };
            // this.$axios.post(this.url, {
            //     page: this.cur_page
            // }).then((res) => {
            // this.tableData = res.data.list;
            // })
            this.tableData = vuetable.list;
            this.totalNum = this.tableData.length;
        },
        search() {
            this.is_search = true;
        },
        formatter(row, column) {
            return row.address;
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        handleEdit(index, row) {
            this.value = row.bankId;
            this.form = {
                Guid: row.Guid,
                BankId: row.BankId,
                Name: row.Name,
                Level: row.Level,
                ApplyAddress: row.ApplyAddress,
                Type: row.Type,
                Description: row.Description,
                Quota: row.Quota,
                Recommend: row.Recommend,
                RightsInterests: row.RightsInterests,
                PublishDate: row.PublishDate,
                CreateTime: new Date(),
                Sorting: 0,
                Enable: row.Enable,
                Btn: '2' //识别是点击添加还是编辑1=添加；2=编辑
            }
            console.log(this.form)
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.idx = index;
            this.delVisible = true;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 保存编辑
        saveEdit() {
            if (this.bankId != '') {
                if (this.form.Btn == 2) {
                    delete this.form.Btn
                    delete this.form.CreateTime
                    this.$axios.post(`${this.baseUrl}/api/CreditCard/UpdateCreditCard`, this.$qs.stringify(this.form))
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
                    delete this.form.BankId
                    delete this.form.CreateTime
                    this.$axios.post(`${this.baseUrl}/api/CreditCard/AddCreditCard`, this.$qs.stringify(this.form))
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
            }
            this.editVisible = false
            this.getUserList()

        },
        //获取所有银行
        getBankList() {

            this.$axios.post(`${this.baseUrl}/api/Bank/GetBankSelectList`)
                .then((res) => {
                    if (res.data.Success == true) {
                        this.options = res.data.Data
                        console.log(res.data.Data)
                        // this.$message.success(res.data.message);
                    } else {
                        this.$message.success('获取失败');
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        // 确定删除
        deleteRow() {
            this.tableData.splice(this.idx, 1);
            this.$message.success('删除成功');
            this.delVisible = false;
        }
    }
}

</script>
<style lang="less">
.cardsTable {
    .el-dialog {
        .el-dialog__header {
            padding: 10px 20px 10px;
        }
        .el-dialog__body {
            padding: 0 20px;
            .el-form-item {
                margin-bottom: 20px;
            }
            .el-upload--text {
                border: 0;
                height: auto;
                width: auto;
            }
            .el-upload__tip {
                margin-top: 0;
            }
            .el-form-item__content {
                line-height: normal;
            }
        }
    }
    .demo-table-expand {
        font-size: 0;
    }
    .handle-box {
        margin-bottom: 20px;
    }
    .demo-table-expand label {
        width: 110px;
        color: #99a9bf;
        font-size: 16px;
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

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
}

</style>
