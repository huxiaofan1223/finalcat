<template>
<el-row >
    <el-col style="padding-right:10px;" :span="3">
        <el-form-item>
            <el-input v-model="item.COLUMN_NAME" placeholder="名字" @blur="handleColumnChange(item)"  @keyup.enter.native="handleColumnChange(item)"></el-input>
        </el-form-item>
    </el-col>
    <el-col style="padding-right:10px;" :span="2">
        <el-form-item>
            <type-select v-model="item.DATA_TYPE" placeholder="类型" @change="handleColumnChange(item)"></type-select>
        </el-form-item>
    </el-col>
    <el-col style="padding-right:10px;" :span="2">
        <el-form-item>
            <el-input v-model="item.length" placeholder="长度" @blur="handleColumnChange(item)" @keyup.enter.native="handleColumnChange(item)"></el-input>
        </el-form-item>
    </el-col>
    <el-col style="padding-right:10px;" :span="3">
        <el-form-item>
            <el-select v-model="item.COLUMN_DEFAULT"
                filterable
                allow-create
                default-first-option placeholder="默认"
                @change="handleColumnChange(item)">
                <el-option label="无" value=""></el-option>
                <el-option label="CURRENT_TIMESTAMP" value="CURRENT_TIMESTAMP"></el-option>
            </el-select>
        </el-form-item>
    </el-col>
    <el-col style="padding-right:10px;" :span="3">
        <el-form-item>
            <collate-select v-model="item.COLLATION_NAME" placeholder="排序规则" @change="handleColumnChange(item)"></collate-select>
        </el-form-item>
    </el-col>
    <el-col style="padding-right:10px;" :span="3">
        <el-form-item>
            <el-select v-model="item.EXTRA" placeholder="属性" @change="handleColumnChange(item)">
                <el-option label="无" value=""></el-option>
                <el-option label="BINARY" value="BINARY"></el-option>
                <el-option label="UNSIGNED" value="UNSIGNED"></el-option>
                <el-option label="UNSIGNED ZEROFILL" value="UNSIGNED ZEROFILL"></el-option>
                <el-option label="on update CURRENT_TIMESTAMP" value="on update CURRENT_TIMESTAMP"></el-option>
            </el-select>
        </el-form-item>
    </el-col>
    <el-col style="padding-right:10px;" :span="1">
        <el-form-item>
            <el-checkbox v-model="item.IS_NULLABLE" true-label="YES" false-label="NO" placeholder="可为空" @change="handleColumnChange(item)"></el-checkbox>
        </el-form-item>
    </el-col>
    <el-col style="padding-right:10px;" :span="1">
        <el-form-item>
            <el-checkbox v-model="item.AI" placeholder="自增" @change="handleColumnChange(item)"></el-checkbox>
        </el-form-item>
    </el-col>
    <el-col :span="4" style="padding-right:10px;">
        <el-form-item>
            <el-input v-model="item.COLUMN_COMMENT" placeholder="备注" @blur="handleColumnChange(item)" @keyup.enter.native="handleColumnChange(item)"></el-input>
        </el-form-item>
    </el-col>
    <el-col :span="2">
        <el-form-item>
            <!-- <el-button v-if="!item.insert" icon="el-icon-top" size="mini" circle style="padding:3px;" @click="handleModify(index,true)" :disabled="index===0"></el-button>
            <el-button v-if="!item.insert" icon="el-icon-bottom" size="mini" circle style="padding:3px;" @click="handleModify(index,false)" :disabled="index===form.fields.length-1"></el-button> -->
            <!-- <template v-if="item.insert">
                <el-button icon="el-icon-check" size="mini" circle style="padding:3px;" @click="handleColumnChange(item)"></el-button>
                <el-button icon="el-icon-close" size="mini" circle style="padding:3px;" @click="handleEditCancel(index)"></el-button>
            </template> -->
            <slot name="drag"></slot>
            <el-button size="mini" icon="el-icon-delete" circle style="padding:3px;" v-if="!item.insert" type="danger" @click="handleRemove(item)"></el-button>
        </el-form-item>
    </el-col>
</el-row>
</template>

<script>
import TypeSelect from '../../components/TypeSelect';
import CollateSelect from '../../components/CollateSelect';
import EngineSelect from '../../components/EngineSelect';
export default {
    props:{
        item:{
            type:Object,
            required:true
        }
    },
    components:{
        TypeSelect,CollateSelect,EngineSelect
    },
    methods:{
        handleColumnChange(item){
            console.log(item);
            this.$emit('handleColumnChange',item);
        },
        handleRemove(item){
            this.$emit('handleRemove',item);
        }
    }
}
</script>