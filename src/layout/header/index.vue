<template>
    <div class="header">
        <div class="header-name">
            至轻云
        </div>
        <div class="header-user">
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ 'admin' }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <!-- <el-dropdown-item>个人信息</el-dropdown-item> -->
                        <el-dropdown-item>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-avatar :size="32">{{ 'a' }}</el-avatar>
        </div>
    </div>
</template>

<style lang="scss">
.header {
    min-width: 960px;
    height: 60px;
    box-shadow: $--app-box-shadow;
    background-color: $--app-light-color;
    display: flex;
    justify-content: space-between;
    z-index: 100;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    .header-name {
        font-size: $--app-title-large-font-size;
        font-weight: $--app-base-font-weight;
        height: 100%;
        display: flex;
        align-items: center;
        padding-left: 24px;
    }
    .header-user {
        display: flex;
        height: 100%;
        align-items: center;
        padding-right: 20px;
        .el-dropdown-link {
            cursor: default;
        }
        .el-dropdown {
            margin-right: 12px;
        }
        .el-avatar {
            background-color: $--app-primary-color;
            color: $--app-light-color;
            font-size: $--app-small-font-size;
        }
    }
}
.el-dropdown-menu {
    .el-dropdown-menu__item {
        font-size: $--app-small-font-size;
    }
}
</style>
