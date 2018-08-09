<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="真实姓名">
                                <span>{{ props.row.Name}}</span>
                            </el-form-item>
                            <el-form-item label="昵称">
                                <span>{{ props.row.UserName }}</span>
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <span>{{ props.row.Email }}</span>
                            </el-form-item>
                            <el-form-item label="用户 ID">
                                <span>{{ props.row.Guid }}</span>
                            </el-form-item>
                            <el-form-item label="信用卡ID">
                                <span>{{ props.row.CardId }}</span>
                            </el-form-item>
                            <el-form-item label="手机号码">
                                <span>{{ props.row.address }}</span>
                            </el-form-item>
                            <el-form-item label="用户头像">
                                <img class="userPhoto" :src="props.row.UserPhotos.length>0?props.row.UserPhotos[0].Url:''">
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
                <el-table-column prop="Email" label="邮箱">
                </el-table-column>
                <el-table-column prop="PhoneNumber" label="手机号">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
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
            form: {
                name: '',
                date: '',
                address: ''
            },
            idx: -1
        }
    },
    created() {
        console.log(vuetable)
        // this.getData();
        this.getUserList()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                let is_del = false;
                for (let i = 0; i < this.del_list.length; i++) {
                    if (d.name === this.del_list[i].name) {
                        is_del = true;
                        break;
                    }
                }
                if (!is_del) {
                    if (d.address.indexOf(this.select_cate) > -1 &&
                        (d.name.indexOf(this.select_word) > -1 ||
                            d.address.indexOf(this.select_word) > -1)
                    ) {
                        return d;
                    }
                }
            })
        }
    },
    filters: {
        TimeFormat(val) {
            let Time = moment(val).format('YYYY-MM-DD')
            return Time;
        }
    },
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getUserList();
        },
        //获取用户列表
        getUserList() {
            let vm = this
            // this.$set(this.Page, 'pageNo', this.cur_page);
            // this.$set(this.Page, 'pageSize', 10);
            let value = {
                "Page": {
                    'pageNo': this.cur_page,
                    'pageSize': 10
                }
            }
            console.log(value)
            this.$axios.post(`${this.baseUrl}/api/Account/GetMobileUser`, this.$qs.stringify(value))
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
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                name: item.name,
                date: item.date,
                address: item.address
            }
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.idx = index;
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
            this.$set(this.tableData, this.idx, this.form);
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx+1} 行成功`);
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
<style scoped>
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

</style>
