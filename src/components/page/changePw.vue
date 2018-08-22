<template>
    <div class="ms-login">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
            <el-form-item prop="username">
                <el-input v-model="ruleForm.username" placeholder="请输入管理员账号"></el-input>
            </el-form-item>
            <el-form-item prop="oldpassword">
                <el-input type="password" placeholder="请输入老密码" v-model="ruleForm.oldpassword"></el-input>
            </el-form-item>
            <el-form-item prop="newpassword">
                <el-input type="password" placeholder="请输入老密码" v-model="ruleForm.newpassword"></el-input>
            </el-form-item>
            <div class="login-btn">
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            ruleForm: {
                username: '',
                oldpassword: '',
                newpassword: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                oldpassword: [
                    { required: true, message: '请输入老密码', trigger: 'blur' }
                ],
                newpassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        submitForm(formName) { //?UserName=${this.ruleForm.username}&OldPassWord=${this.ruleForm.oldpassword}&NewPassWord=${this.ruleForm.newpassword}
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let val = {
                        UserName: this.ruleForm.username,
                        OldPassWord: this.ruleForm.oldpassword,
                        NewPassWord: this.ruleForm.newpassword,
                    }
                    this.$axios.post(`${this.baseUrl}/api/Account/AccountLogin`, this.$qs.stringify(val))
                        .then((res) => {
                            if (res.data.Success == true) {
                                window.localStorage.clear()
                                this.$router.push('/');
                            }
                            console.log(res.data)
                        })
                        .catch(function(error) {
                            console.log(error);
                        });

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}

</script>
<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}
.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 200px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
}

</style>
