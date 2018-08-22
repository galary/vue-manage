<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入管理员账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    this.$axios.post(`${this.baseUrl}/api/Account/AccountLogin?UserName=${this.ruleForm.username}&PassWord=${this.ruleForm.password}`)
                        .then((res) => {
                            if (res.data.Success == true) {
                                localStorage.setItem('ms_username', res.data.Data.UserName);
                                localStorage.setItem('ms_Guid', res.data.Data.Guid);
                                this.$router.push('/');
                            } else {
                                this.$message.error(res.data.message);
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
    height: 160px;
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
