# DOM

> Document Object Model

## 1.节点

### 1. 节点类型

**nodeType**

nodeType属性返回节点类型的常数值。不同的类型对应不同的常数值，12种类型分别对应1到12的常数值

**nodeName**

nodeName属性返回节点的名称

**nodeValue**

nodeValue属性返回或设置当前节点的值，格式为字符串

| Attr                  | value of attribute                  |
|:----------------------|:------------------------------------|
| CDATASection          | content of the CDATA Section        |
| Comment               | 注释内容，不包含注释符号 <!-- -->               |
| Document              | null                                |
| DocumentFragment      | null                                |
| DocumentType          | null                                |
| Element               | null                                |
| NamedNodeMap          | null                                |
| EntityReference       | null                                |
| Notation              | null                                |
| ProcessingInstruction | entire content excluding the target |
| Text                  | 节点内容                                |

**1.元素节点**

   	**Node.ELEMENT_NODE (1)**

元素节点element对应网页的HTML标签元素元素节点的节点类型nodeType值是1，节点名称nodeName值是大写的标签名，nodeValue值是null。

**2.特性节点**
**Node.ATTRIBUTE_NODE (2)**
特性节点attribute对应网页种HTML标签的属性，它只存在在元素的attribute属性中，并不是DOM文档树的一部分，特性节点的节点类型nodeType值是2，节点名称nodeName值是属性名，nodeValue值是属性值。

**3.文本节点**
**Node.TEXT_NODE (3)**文本节点text代表网页中的HTML标签内容。文本节点的节点类型nodeType值是3，节点名称nodeName值是'#text'
，nodeValue值是标签内容值。

**4.CDATA节点**
**Node.CDATA_SECTION_NODE (4)**
CDATASection类型只针对XML的文档，只出现在XML文档中。该类型节点的节点类型nodeType的值为4，节点名称nodeName的值为'#cdata-section'
，nodevalue的值是CDATA区域中的内容。

**5.实体引用名称节点**
**Node.ENTITY_REFERENCE_NODE (5)**实体是一个声明，指定了在XML中取代内容或标记而使用的名称，在实体声明中定义的名称将在 XML
中使用。 在XML中使用时，该名称称为实体引用。实体引用名称节点entry_reference的节点类型nodeType的值为5，节点名称nodeName的值为实体引用的名称，nodeValue的值为null。

**6.实体名称节点**
**Node.ENTITY_NODE (6)**使用实体声明将名称绑定到替换内容。 实体声明是使用 <!ENTITY name "value"> 语法在文档类型定义(DTD)
或XML架构中创建的。实体名称节点类型nodeType的值为6，节点名称nodeName的值为实体名称，nodeValue的值为null。

**7.处理指令节点****Node.PROCESSING_INSTRUCTION_NODE (7)**
处理指令节点ProcessingInstruction的节点类型nodeType的值为7，节点名称nodeName的值为target，nodeValue的值为entire content
excluding the target。

**8.注释节点****Node.COMMENT_NODE (8)**
注释节点comment表示网页中的HTML注释。注释节点的节点类型nodeType的值为8，节点名称nodeName的值为'#comment'
，nodeValue的值为注释的内容。

**9.文档节点****Node.DOCUMENT_NODE (9)**
文档节点document表示HTML文档，也称为根节点，指向document对象。文档节点的节点类型nodeType的值为9，节点名称nodeName的值为'#document'
，nodeValue的值为null。

**10.文档类型节点****Node.DOCUMENT_TYPE_NODE (10)**
文档类型节点DocumentType包含着与文档的doctype有关的所有信息。文档类型节点的节点类型nodeType的值为10，节点名称nodeName的值为doctype的名称，nodeValue的值为null。

**11.文档片段节点****Node.DOCUMENT_FRAGMENT_NODE (11)**
文档片段节点DocumentFragment在文档中没有对应的标记，是一种轻量级的文档，可以包含和控制节点，但不会像完整的文档那样占用额外的资源。该节点的节点类型nodeType的值为11，节点名称nodeName的值为'#document-fragment'
，nodeValue的值为null。

**12.DTD声明节点****Node.NOTATION_NODE (12)**
DTD声明节点notation代表DTD中声明的符号。该节点的节点类型nodeType的值为12，节点名称nodeName的值为符号名称，nodeValue的值为null

### 2.获取节点

> 返回值类型为 `nodelist`，是个类数组。可以 使用`forEach` 和 迭代器

Array.from() 转为数组

1. **[`getElementById`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementById)** <p id=''></p>

2. **[`getElementsByClassName()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByClassName)
   ** <p class=''></p>

3. **[`getElementsByTagName()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByTagName)
   ** <p></p>

4. **[`getElementsByName()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByName)
   ** <p name = 'avc' ></p>

5. **[`querySelector()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector)**

6. **[`querySelectorAll)()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll)**

**在HTML当中，一切都是节点**

1. **父节点parentNode**
2. **兄弟节点Sibling**
    1. **nextSibling 上一个兄弟节点**
    2. **previousSibling 下一个兄弟节点**
3. **子节点**
    1. **firstChild** 第一个
    2. **lastChild** 最后一个
    3. **childNodes**/**children**
        1. childNodes 所有类型的子节点
        2. children 所有元素子节点 nodeType 等于 1 的子节点

### 3.